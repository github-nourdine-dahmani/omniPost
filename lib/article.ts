"use server";


import { PrismaClient, Article } from "@prisma/client";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { summarize } from "@/lib/huggingface";

const prisma = new PrismaClient();


export async function refineArticle(article: Article) {

    console.log('>>>> refineArticle', article);

    try {


        if (!article.text) return null;

        const refinedText = await summarize(article.text);
        const refinedTitle = await summarize(article.title);
        const refinedSummary = article.summary ? await summarize(article.summary) : null;

        const refinedArticle = await prisma.post.update({
            where: { id: article.id },
            data: {
                title: refinedTitle,
                content: refinedText,
                summary: refinedSummary,
                refinedAt: new Date(),
            },
        });

        revalidatePath("/");
        revalidatePath("/articles/" + refinedArticle.slug);

        return refinedArticle;
    } catch (error) {
        console.log('>>>> error', error);
    }

}

export async function updateArticle(article: Article) {
    return await prisma.article.update({
        where: { id: article.id },
        data: {
            title: article.title,
            text: article.text,
            summary: article.summary,
            url: article.url
            
        }
    })
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