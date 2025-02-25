import { getJobsByType } from "@/lib/job";
import { JobType } from "@prisma/client";

import PageClient from './page-client';

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Top News",
    description: "Latest Top News",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Seeds() {

    const jobs = await getJobsByType(JobType.FETCH_TOP_NEWS);

    return (
        <>
            <PageClient jobs={jobs} />
        </>
    );
}
