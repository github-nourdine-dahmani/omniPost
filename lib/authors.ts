"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// getAllAuthors function
export async function getAllAuthors() {
    return prisma.author.findMany();
};

// getAuthorBySlug function
export async function getAuthorBySlug(slug: string) {
    return prisma.author.findUnique({
        where: { slug },
    });
};
