"use server";

import { RawArticleSeed, TopNews } from "@/types";
import { PrismaClient, Job, ArticleSeed } from "@prisma/client";
import { randomUUID } from "crypto";
import slugify from "slugify";

const prisma = new PrismaClient();

//politics, sports, business, technology, entertainment, health, science, lifestyle, travel, culture, education, environment, other

export async function searchNews(text: string | null, language: string | null, sourceCountry: string | null, categories: string[]) {
    console.log(">>>> searchNews");

    const res = await fetch(
        // `https://api.worldnewsapi.com/top-news?text=${text}&source-country=${sourceCountry}&language=${language}&categories=${categories.join(",")}&api-key=${process.env.NEXT_PUBLIC_WORLDNEWSAPI_KEY}`
        `https://api.worldnewsapi.com/top-news?source-country=fr&language=fr&categories=lifestyle&api-key=${process.env.NEXT_PUBLIC_WORLDNEWSAPI_KEY}`
    );

    // if(!res.ok) {
    //     console.log(res.message)
    //     throw new Error('Failed to fetch top news');
    // }

    const data = await res.json();

    return data;
}

export async function fetchTopNews() {
    console.log(">>>> fetchTopNews");

    // const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`)
    // const data = await res.json();

    const res = await fetch(
        `https://api.worldnewsapi.com/top-news?source-country=fr&language=fr&api-key=${process.env.NEXT_PUBLIC_WORLDNEWSAPI_KEY}`
    );

    // if(!res.ok) {
    //     console.log(res.message)
    //     throw new Error('Failed to fetch top news');
    // }

    const data = await res.json();

    return data;
}

export async function collectTopNews(
    job: Job,
    limit: number = 10
): Promise<TopNews[]> {
    console.log(">>>> collectTopNews");

    // console.log('>>>> job data', job?.data);

    const data = job?.data ? JSON.parse(job.data) : undefined;

    if (!data) {
        console.log("no data");
        return [];
    }

    // console.log(">>>> databaseArticleSeeds", databaseArticleSeeds);

    const topNews: TopNews[] = data.top_news
        .slice(0, limit)
        .flatMap((news: any) => {
            // const parentExternalId = `${news.news[0].id}`
            return news.news.slice(0, 1).map((data: any) => {

                const articleSeed = job.articleSeeds.find(
                    (articleSeed: ArticleSeed) =>
                        articleSeed.externalId === `${data.id}`
                );

                // console.log(">>>> data.id", data.id);
                // console.log(">>>> articleSeed", articleSeed);

                return {
                          externalId: `${data.id}`,
                          title: data.title,
                          image: data.image,
                          text: data.text,
                          summary: data.summary,
                          language: data.language,
                          url: data.url,
                          source_country: data.source_country,
                          category: data.category,
                          publishDate: data.publish_date
                              ? new Date(data.publish_date)
                              : undefined,
                          author: data.author,
                          seedJobId: job.id,
                          articleSeed: articleSeed
                      };
            });
        });

    // console.log('>>>> topNews', topNews);

    return topNews;
}