"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Server action to get all tags
export async function getAllTags() {
    return prisma.tag.findMany();
}

// Server action to get a tag by slug
export async function getTagBySlug(slug: string) {
    return prisma.tag.findUnique({
        where: { slug },
    });
}

// Create a new tag if it doesn't exist
export async function createTagIfNotExists(name: string) {
    const existingTag = await prisma.tag.findUnique({
        where: { name },
    });

    if (existingTag) {
        return existingTag;
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    return prisma.tag.create({
        data: {
            name,
            slug,
        },
    });
}
