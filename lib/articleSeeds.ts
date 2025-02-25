"use server";

import { TopNews } from "@/types";
import { PrismaClient, Job, Article, ArticleSeed } from "@prisma/client";
import { randomUUID } from "crypto";
import slugify from 'slugify';

const prisma = new PrismaClient();

export async function getArticleSeed(id: number): Promise<ArticleSeed | null> {
    return prisma.articleSeed.findUnique({
        where: { id },
        include: { seedJob: true, posts: true },
    });
}

export async function createArticleSeed(topNews: TopNews): Promise<ArticleSeed> {

    // console.log('>>>> createArticleSeed', articleSeed);

    try {

        const persistedArticle = await prisma.articleSeed.create({
            data: {
                externalId: topNews.externalId,
                seedData: JSON.stringify(topNews),
                seedJob: {
                    connect: {
                        id: topNews.seedJobId
                    }
                }
            }
        })

        return persistedArticle;
    } catch (error) {
        console.log('>>>> error', error);
        throw new Error('Failed to persist article', { cause: error });
    }
}


export async function editArticleSeed(
    articleSeed: ArticleSeed
): Promise<ArticleSeed> {
    // console.log('>>>> createArticleSeed', articleSeed);

    try {
        const persistedArticle = await prisma.articleSeed.update({
            where: { id: articleSeed.id },
            data: {
                seedData: articleSeed.seedData,
            },
        });

        return persistedArticle;
    } catch (error) {
        console.log(">>>> error", error);
        throw new Error("Failed to persist article", { cause: error });
    }
}

export async function deleteArticleSeed(articleSeed: ArticleSeed) {
    console.log('>>>> deleteArticleSeed', articleSeed);

    return await prisma.articleSeed.delete({
        where: { id: articleSeed.id },
    });
}


export async function resetArticleSeed(articleSeed: ArticleSeed) {
    try {
        console.log('Resetting article:', articleSeed.id);

        const articleSeedData = articleSeed.seedData ? JSON.parse(articleSeed.seedData) : null;

        if (!articleSeedData) {
            throw new Error('No seed data available for this article');
        }

        const updatedArticle = await prisma.article.update({
            where: { id: articleSeed.id },
            data: {
                title: articleSeedData.title,
                text: articleSeedData.text ?? null,
                summary: articleSeedData.summary ?? null,
                url: articleSeedData.url ?? null,
                image: articleSeedData.image ?? null,
                video: articleSeedData.video ?? null,
                author: articleSeedData.author ?? null,
                category: articleSeedData.category ?? null,
                language: articleSeedData.language ?? null,
                sourceCountry: articleSeedData.source_country ?? null,
            },
        });

        console.log('Article reset successfully:', updatedArticle.title);
        // revalidatePath("/articles/seeds");
        return updatedArticle;
    } catch (error) {
        console.error('Error resetting article:', error);
        throw error; // Re-throw to allow caller to handle the error
    }
}