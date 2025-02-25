"use server";

import { PrismaClient, Transformation } from "@prisma/client";
import { cache } from "react";

const prisma = new PrismaClient();

// Cache getAllTransformations function
export const getAllTransformations = cache(async (): Promise<Transformation[]> => {
    const transformations = await prisma.transformation.findMany({
        include: { posts: {
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
        } },
        orderBy: {
            createdAt: "desc",
        },
    });

    return transformations as Transformation[];
});


export async function getTransformation(transformationId: number): Promise<Transformation | null> {
    const result = await prisma.transformation.findUnique({
        where: { id: transformationId },
        include: { posts: true }
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
