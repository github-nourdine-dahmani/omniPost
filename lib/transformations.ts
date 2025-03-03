"use server";

import { PrismaClient, Transformation, PostPublishStatus, PostTransformationStatus, Post } from "@prisma/client";
import { cache } from "react";
import { processText } from "@/lib/openai";
import { updatePost, updatePostPublishStatus, updatePostTransformationStatus } from "./posts";

const prisma = new PrismaClient();

// Cache getAllTransformations function
export const getAllTransformations = cache(async (): Promise<Transformation[]> => {
    const transformations = await prisma.transformation.findMany({
        include: {
            posts: {
                include: {
                    articleSeed: {
                        include: {
                            posts: {
                                include: {
                                    transformation: true
                                }
                            }
                        }
                    },
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return transformations as Transformation[];
});


export async function getTransformation(transformationId: number): Promise<Transformation | null> {
    const result = await prisma.transformation.findUnique({
        where: { id: transformationId },
        include: {
            posts: {
                include: {
                    articleSeed: {
                        include: {
                            posts: {
                                include: {
                                    transformation: true
                                }
                            }
                        }
                    },
                }
            }
        },
    });

    return result;
}


// Delete a transformation
export async function deleteTransformation(id: number) {
    return prisma.transformation.delete({
        where: { id },
    });
}

// Create a new transformation
export async function createTransformation(data: any) {
    return prisma.transformation.create({
        data: {
            name: data.name,
            params: data.params
        }
    });
}

export async function updateTransformation(formData: FormData) {

    const id = parseInt(formData.get('id')?.toString() || '0', 10);
    const name = formData.get('name')?.toString() || '';
    const params = formData.get('params')?.toString() || '';

    if (!name || !params) {
        throw new Error('Name and params are required');
    }

    const transformation = await prisma.transformation.findUnique({
        where: { id },
    });

    if (!transformation) {
        throw new Error('Transformation not found');
    }

    try {
        const updatedTransformation = await prisma.transformation.update({
            where: { id },
            data: {
                name,
                params
            },
        });
        return updatedTransformation;
    } catch (error) {
        console.error('Error updating transformation:', error);
        throw new Error('Failed to update transformation');
    }
}

interface TextProcessConfig {
    fieldName: 'title' | 'summary' | 'text';
    prompt: string;
}

async function processPostTextField(
    post: Post,
    textProcess: TextProcessConfig
): Promise<void> {
    const fieldName = textProcess.fieldName;
    const fieldValue = post[fieldName as keyof Post];

    // Early return if no value for the field
    if (!fieldValue || typeof fieldValue !== 'string') {
        console.log(`No ${fieldName} to process for post ${post.id}`);
        return;
    }

    try {
        const processData = await processText(fieldValue, textProcess.prompt);

        if (processData.success) {
            // Update the specific field
            post[fieldName as keyof Post] = processData.data;
            console.log(`Processed ${fieldName} for post ${post.id}`);
        } else {
            console.warn(`Failed to process ${fieldName} for post ${post.id}`);
        }
    } catch (error) {
        console.error(`Error processing ${fieldName} for post ${post.id}:`, error);
    }
}

export async function processPost(
    post: Post & { transformation: Transformation }
): Promise<Post> {
    try {
        // Update post status to processing
        await updatePostTransformationStatus(post, PostTransformationStatus.PROCESSING);

        const transformation = post.transformation;

        // Parse transformation parameters
        const params = JSON.parse(transformation.params ?? '{}');

        // Process text fields concurrently
        await Promise.all(
            params.textProcess.map(async (textProcess: TextProcessConfig) => {
                // await processPostTextField(post, textProcess);
                const fieldName = textProcess.fieldName;
                const fieldValue = post[fieldName as keyof Post];

                // Early return if no value for the field
                if (!fieldValue || typeof fieldValue !== 'string') {
                    console.log(`No ${fieldName} to process for post ${post.id}`);
                    return;
                }

                try {
                    const processData = await processText(fieldValue, textProcess.prompt);

                    if (processData.success) {
                        // Update the specific field
                        post[fieldName as keyof Post] = processData.data;
                        console.log(`Processed ${fieldName} for post ${post.id}`);
                    } else {
                        console.warn(`Failed to process ${fieldName} for post ${post.id}`);
                    }
                } catch (error) {
                    console.error(`Error processing ${fieldName} for post ${post.id}:`, error);
                }
            })
        );

        // Update post to completed
        console.log(`Completed processing post: ${post.id}`);
        return await updatePost({
            ...post,
            transformationStatus: PostTransformationStatus.COMPLETED
        });
    } catch (error) {
        // Log detailed error information
        console.error(`Error processing post ${post.id}:`, {
            transformationId: transformation.id,
            transformationName: transformation.name,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            postDetails: {
                id: post.id,
                title: post.title,
                transformationStatus: post.transformationStatus
            }
        });

        // Update post status to failed
        return await updatePostTransformationStatus(post, PostTransformationStatus.FAILED);
    }
}

export async function process(transformation: Transformation) {
    // Find posts to process
    const posts = await prisma.post.findMany({
        where: {
            transformationStatus: PostTransformationStatus.QUEUED,
            transformation: {
                id: transformation.id
            }
        },
        include: { transformation: true },
        // take: 1
    });

    console.log(`Processing transformation: ${transformation.name}, Posts: ${posts.length}`);

    // Process posts concurrently
    const processedPosts = await Promise.all(
        posts.map(post => processPost(post))
    );

    return processedPosts;
}