import ArticleSeedCard from "@/components/ArticleSeedCard";
import { getAllArticles } from "@/lib/article";

import PageClient from './page-client';

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Articles",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Articles() {

    const articles = await getAllArticles();

    return (
        <>
            <PageClient articles={articles} />
        </>
    );
}
