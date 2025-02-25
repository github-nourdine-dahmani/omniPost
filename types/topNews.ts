import { ArticleSeed } from "@prisma/client";

export interface TopNews {
    externalId: string | null;
    title: string | null;
    text: string | null;
    summary: string | null;
    language: string | null;
    url: string | null;
    source_country: string | null;
    image: string | null;
    category: string | null;
    publishDate: Date | null;
    author: string | null;
    seedJobId: number;
    articleSeed: ArticleSeed | null;
}