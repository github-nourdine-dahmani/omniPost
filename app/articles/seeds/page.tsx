import ArticleSeedCard from "@/components/ArticleSeedCard";
// import { fetchHeadlines } from "@/lib/new sapi";
import { getAllJobs } from "@/lib/job";
import { collectTopNews } from "@/lib/worldnewsapi";
import { JobType } from "@prisma/client";

import PageClient from './page-client';

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Articles",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Articles() {

    const jobs = await getAllJobs(JobType.FETCH_TOP_NEWS);

    // console.log('>>>> jobs', jobs);

    return (
        <>
            <PageClient jobs={jobs} />
        </>
    );
}
