"use server";

import { RawArticleSeed } from "@/types/article";
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

export async function collectArticleSeeds(job: Job, limit: number = 10): Promise<ArticleSeed[]> {

    console.log('>>>> collectArticleSeeds');

    // console.log('>>>> job data', job?.data);

    const data = job?.data ? JSON.parse(job.data) : undefined;

    if (!data) {
        console.log('no data');
        return [];
    }

    // console.log('>>>> data', data);

    const articles: ArticleSeed[] = data.top_news.slice(0, limit).flatMap((news: any) => {
        return news.news.slice(0, 1).map((data: any) => (
            {
                externalId: `${data.id}`,
                seedData: JSON.stringify(data),
                seedJob: {
                    connect: {
                        id: job.id
                    }
                }

            })
        )
    }
    );

    return articles;
}

export async function createArticleSeeds(jobArticleSeeds: RawArticleSeed[]): Promise<ArticleSeed[]> {
    console.log('>>>> createArticleSeeds');

    try {
        const persistedArticles = await Promise.all(
            jobArticleSeeds.map(jobArticleSeed => createArticleSeed(jobArticleSeed))
        );

        return persistedArticles;

    } catch (error) {
        console.log('>>>> error', error);
        throw new Error('Failed to persist articles', { cause: error });
    }
}

export async function createArticleSeed(articleSeed: RawArticleSeed): Promise<ArticleSeed> {

    // console.log('>>>> createArticleSeed', articleSeed);

    try {

        const persistedArticle = await prisma.articleSeed.create({
            data: {
                externalId: articleSeed.externalId,
                seedData: JSON.stringify(articleSeed),
                seedJob: {
                    connect: {
                        id: articleSeed.seedJobId
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
    articleSeed: RawArticleSeed
): Promise<ArticleSeed> {
    // console.log('>>>> createArticleSeed', articleSeed);

    try {
        const persistedArticle = await prisma.articleSeed.update({
            where: { id: articleSeed.id },
            data: {
                seedData: JSON.stringify(articleSeed),
            },
        });

        return persistedArticle;
    } catch (error) {
        console.log(">>>> error", error);
        throw new Error("Failed to persist article", { cause: error });
    }
}

export async function deleteArticleSeed(articleSeed: RawArticleSeed) {
    console.log('>>>> deleteArticleSeed', articleSeed.externalId);

    const articleSeedToDelete = await prisma.articleSeed.findFirst({
        where: { externalId: articleSeed.externalId },
    })

    if (!articleSeedToDelete) {
        throw new Error(
            `Article seed with externalId ${articleSeed.externalId} not found`
        );
    }

    return await prisma.articleSeed.delete({
        where: { id: articleSeedToDelete.id },
    });
}