"use server";

import { PrismaClient, Post, PostStatus, Transformation, ArticleSeed } from "@prisma/client";
import { cache } from "react";
import { PostWithTransformation } from '@/lib/prisma';
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
export async function deletePost(post: Post) {
    return prisma.post.delete({
        where: { id: post.id },
    });
}

// Create a new post
export async function createPost(articleSeed: ArticleSeed, transformation?: Transformation): Promise<Post> {

    const articleSeedData = JSON.parse(articleSeed?.seedData ?? '{}');

    console.log('>>>> createPost', articleSeedData);

    return prisma.post.create({
        data: {
            title: articleSeedData.title ?? '',
            slug: slugify(articleSeedData.title ?? '', { lower: true, strict: true }) + '-' + randomUUID(),
            text: articleSeedData.text ?? '',
            summary: articleSeedData.summary ?? '',
            published: false,
            coverImage: articleSeedData.image ?? '',
            url: articleSeedData.url ?? '',
            language: articleSeedData.language ?? '',
            sourceCountry: articleSeedData.source_country ?? '',
            transformation: {
                connect: transformation?.id ? { id: transformation.id } : undefined,
            },
            articleSeed: {
                connect: {
                    id: articleSeed.id
                }
            }
        },
        include: { transformation: true }
    });
}

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
                coverImage: post.coverImage,
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
