"use server";


import { PrismaClient, Article } from "@prisma/client";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { refine, RefineOptions } from "@/lib/openai";

const prisma = new PrismaClient();

// export async function refineArticles(force: boolean = false) {
//     console.log('>>>> refineArticles');
//     try {
//         const articles = await getAllArticles(true)

//         const refinedArticles = articles.slice(0, 1).filter(article => force || article.refinedAt === null).map(article => {
//             return getRefineArticle(article);
//         })

//         return refinedArticles;
//     } catch (error) {
//         console.log('>>>> error', error);
//     }
// }

export async function getRefineArticle(article: Article) {

    console.log('>>>> getRefineArticle', article);

    try {

        const articleSeedData = article.seedData ? JSON.parse(article.seedData) : null;

        if (!articleSeedData || !articleSeedData.title || !articleSeedData.text) {
            throw new Error('Title and content are required');
        }

        // const refinedTitleData = await refine(articleSeedData.text, RefineOptions.REWRITE);
        // const refinedTextData = await refine(articleSeedData.text, RefineOptions.SUMMARIZE_3P);
        // const refinedSummaryData = articleSeedData.summary ? await refine(articleSeedData.text, RefineOptions.SUMMARIZE_1S) : null;

        // const refinedArticle = {
        //     ...article,
        //     title: refinedTitleData,
        //     text: refinedTextData,
        //     summary: refinedSummaryData,
        // }

        // console.log('>>>> refinedTextData', refinedTextData)
        // console.log('>>>> refinedTextData JSON', JSON.parse(refinedTextData).summary_text)
        // console.log('>>>> refinedTextData', refinedTitleData[0].summary_text)
        // console.log('>>>> refinedTitleData JSON', JSON.parse(refinedTitleData).summary_text)

        // const refinedArticle = await prisma.article.update({
        //     where: { id: article.id },
        //     data: {
        //         title: refinedTextData[0].summary_text,
        //         text: refinedTextData[0].summary_text,
        //         // summary: JSON.parse(refinedSummaryData).summary_text,
        //         refinedAt: new Date(),
        //     },
        // });

        // revalidatePath("/articles/" + refinedArticle.slug);

        return refinedArticle;

    } catch (error) {
        console.log('>>>> error', error);
    }

}

export async function updateArticle(article: Article) {
    return await prisma.article.update({
        where: { id: article.id },
        data: {
            ...article,
            updatedAt: undefined
        }
    })
}


export async function resetArticle(article: Article) {
    try {
        console.log('Resetting article:', article.id);

        const articleSeedData = article.seedData ? JSON.parse(article.seedData) : null;

        if (!articleSeedData) {
            throw new Error('No seed data available for this article');
        }

        console.log('Seed data:', articleSeedData.title);

        const updatedArticle = await prisma.article.update({
            where: { id: article.id },
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
                refinedAt: null, // Reset refinedAt timestamp
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

// Cache getAllArticles function
export const getAllArticles = cache(async (includeUnpublished = true, refined = false): Promise<Article[]> => {

    return await prisma.article.findMany({
        where: includeUnpublished ? {} : { published: true },
        orderBy: {
            createdAt: "desc",
        },
    });

});

// Cache getPostBySlug function
export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
    const article = await prisma.article.findUnique({
        where: { slug },
    });

    return article as Article | null;
});


export async function deleteArticle(article: Article) {
    return await prisma.article.delete({
        where: { id: article.id },
    })
}

export async function publishArticle(article: Article) {
    return await prisma.article.update({
        where: { id: article.id },
        data: { published: true },
    })
}

export async function unPublishArticle(article: Article) {
    return await prisma.article.update({
        where: { id: article.id },
        data: { published: false },
    })
}