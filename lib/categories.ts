"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// getAllCategories function
export async function getAllCategories() {
    return prisma.category.findMany();
};

// getCategoryBySlug function
export async function getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
        where: { slug },
    });
};


// Create a new category if it doesn't exist
export async function createCategoryIfNotExists(name: string) {
    const existingCategory = await prisma.category.findUnique({
        where: { name },
    });

    if (existingCategory) {
        return existingCategory;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    return prisma.category.create({
        data: {
            name,
            slug,
        },
    });
}
