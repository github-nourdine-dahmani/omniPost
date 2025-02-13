"use server";

import { PrismaClient, Post as PrismaPost } from "@prisma/client";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { Post, CreatePostData, UpdatePostData } from '@/types';

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
export async function deletePost(id: number) {
    return prisma.post.delete({
        where: { id },
    });
}

// Create a new post
export async function createPost(data: CreatePostData) {
    return prisma.post.create({
        data: {
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt,
            published: data.published,
            author: { connect: { id: data.author?.id } },
            category: { connect: { id: data.category?.id } },
            tags: {
                connect: data.tags?.map(tag => ({ id: tag.id })) || [],
            },
            images: {
                connect: data.images?.map(image => ({ id: image.id })) || [],
            },
        },
        include: {
            author: true,
            category: true,
            tags: true,
            images: true,
        },
    });
}

export async function updatePost(formData: FormData) {

    const id = parseInt(formData.get('id')?.toString() || '0', 10);
    const title = formData.get('title')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const authorId = formData.get('authorId')?.toString() || '';
    const categoryId = formData.get('categoryId')?.toString() || '';
    const published = formData.get('published')?.toString() === 'true';

    if (!title || !content) {
        throw new Error('Title and content are required');
    }

    const tagIds = formData.getAll('tags[]').map(id => parseInt(id.toString()));

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            tags: true,
        },
    });

    if (!post) {
        throw new Error('Post not found');
    }

    try {
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                author: { connect: { id: parseInt(authorId, 10) } },
                category: { connect: { id: parseInt(categoryId, 10) } },
                tags: {
                    connect: tagIds?.map(tagId => ({ id: tagId })) || [],
                    disconnect: post?.tags?.filter(tag => !tagIds?.some(newTagId => newTagId === tag.id))?.map(tag => ({ id: tag.id })) || [],
                },
                published,
                // Set publishedAt only when the post is published for the first time
                ...(published && !post.publishedAt ? { publishedAt: new Date() } : {}),
                updatedAt: new Date(),
            },
        });

        revalidatePath("/");
        revalidatePath("/posts/" + updatedPost.slug);

        return updatedPost;
    } catch (error) {
        console.error('Error updating post:', error);
        throw new Error('Failed to update post');
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
