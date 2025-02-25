"use server";

import { PrismaClient, Post,PostStatus, Transformation, ArticleSeed } from "@prisma/client";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { CreatePostData, UpdatePostData, RawArticleSeed } from '@/types';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Cache getAllPosts function
export const getAllPosts = cache(async (includeUnpublished = true): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
        where: includeUnpublished ? {} : { published: true },
        include: {
            author: true,
            category: true,
            tags: true,
            images: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return posts as Post[];
});

// Cache getPostBySlug function
export const getPostsByArticleSeed = cache(async (articleSeedId: number): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
        where: { articleSeedId },
        include: {
            transformation: true,
        },
    });

    return posts as Post[];
});


// Cache getPostBySlug function
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: true,
            category: true,
            tags: true,
            images: true,
        },
    });

    return post as Post | null;
});

// Delete a post
export async function deletePost(id: number) {
    return prisma.post.delete({
        where: { id },
    });
}

// Create a new post
export async function createPost(articleSeed: RawArticleSeed, transformation?: Transformation) {

    // const seedData = JSON.parse(articleSeed?.seedData ?? '{}');
    console.log('>>>> createPost', articleSeed, transformation);

    return prisma.post.create({
        data: {
            title: articleSeed.title ?? '',
            slug: slugify(articleSeed.title ?? '', { lower: true, strict: true })+'-' + randomUUID(),
            text: articleSeed.text ?? '',
            summary: articleSeed.summary ?? '',
            published: false,
            coverImage: articleSeed.image ?? '',
            url: articleSeed.url ?? '',
            language: articleSeed.language ?? '',
            sourceCountry: articleSeed.source_country ?? '',
            transformation: transformation ? {
                connect: transformation,
            } : undefined,
            articleSeed: articleSeed.id ? {
                connect: {
                    id: articleSeed.id
                }
            } : undefined
        }
    });
}
// // Create a new post
// export async function createPost(articleSeed: ArticleSeed, transformation?: Transformation) {

//     const seedData = JSON.parse(articleSeed?.seedData ?? '{}');
//     // console.log('>>>> seedData', seedData);

//     return prisma.post.create({
//         data: {
//             title: seedData.title ?? '',
//             slug: slugify(seedData.title ?? '', { lower: true, strict: true })+'-' + randomUUID(),
//             text: seedData.text ?? '',
//             summary: seedData.summary ?? '',
//             published: false,
//             coverImage: seedData.image ?? '',
//             transformation: transformation ? {
//                 connect: transformation,
//             } : undefined,
//             articleSeed: {
//                 connect: articleSeed
//             }
//         }
//     });
// }

// export async function updatePost(formData: FormData) {

//     const id = parseInt(formData.get('id')?.toString() || '0', 10);
//     const title = formData.get('title')?.toString() || '';
//     const text = formData.get('text')?.toString() || '';
//     const summary = formData.get('summary')?.toString() || '';
//     const authorId = formData.get('authorId')?.toString() || '';
//     const categoryId = formData.get('categoryId')?.toString() || '';
//     const published = formData.get('published')?.toString() === 'true';

//     if (!title || !text) {
//         throw new Error('Title and text are required');
//     }

//     const tagIds = formData.getAll('tags[]').map(id => parseInt(id.toString()));

//     const post = await prisma.post.findUnique({
//         where: { id },
//         include: {
//             tags: true,
//         },
//     });

//     if (!post) {
//         throw new Error('Post not found');
//     }

//     try {
//         const updatedPost = await prisma.post.update({
//             where: { id },
//             data: {
//                 title,
//                 text,
//                 author: { connect: { id: parseInt(authorId, 10) } },
//                 category: { connect: { id: parseInt(categoryId, 10) } },
//                 tags: {
//                     connect: tagIds?.map(tagId => ({ id: tagId })) || [],
//                     disconnect: post?.tags?.filter(tag => !tagIds?.some(newTagId => newTagId === tag.id))?.map(tag => ({ id: tag.id })) || [],
//                 },
//                 published,
//                 // Set publishedAt only when the post is published for the first time
//                 ...(published && !post.publishedAt ? { publishedAt: new Date() } : {}),
//                 updatedAt: new Date(),
//             },
//         });

//         revalidatePath("/");
//         revalidatePath("/posts/" + updatedPost.slug);

//         return updatedPost;
//     } catch (error) {
//         console.error('Error updating post:', error);
//         throw new Error('Failed to update post');
//     }
// }



export async function updatePost(
    post: Post
): Promise<Post> {

    try {
        const persistedPost = await prisma.post.update({
            where: { id: post.id },
            data: {
                // ...post,
                title: post.title,
                // slug: post.slug,
                summary: post.summary,
                text: post.text,
                // published: post.published,
                url: post.url,
            },
        });

        return persistedPost;
    } catch (error) {
        console.log(">>>> error", error);
        throw new Error("Failed to persist post", { cause: error });
    }
}


export async function updatePostStatus(
    post: Post,
    status: PostStatus
): Promise<Post> {

    try {
        const persistedPost = await prisma.post.update({
            where: { id: post.id },
            data: {
                status: status,
            },
        });

        return persistedPost;
    } catch (error) {
        console.log(">>>> error", error);
        throw new Error("Failed to persist post", { cause: error });
    }
}

// Cache getPostsByCategory function
export const getPostsByCategory = cache(async (categorySlug: string): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
        where: {
            category: {
                slug: categorySlug,
            },
            published: true,
        },
        include: {
            author: true,
            category: true,
            tags: true,
            images: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return posts as Post[];
});

// Cache getPostsByTag function
export const getPostsByTag = cache(async (tagSlug: string): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
        where: {
            tags: {
                some: {
                    slug: tagSlug,
                },
            },
            published: true,
        },
        include: {
            author: true,
            category: true,
            tags: true,
            images: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return posts as Post[];
});

// Cache getPostsByAuthor function
export const getPostsByAuthor = cache(async (authorId: number): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
        where: {
            authorId,
            published: true,
        },
        include: {
            author: true,
            category: true,
            tags: true,
            images: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return posts as Post[];
});
