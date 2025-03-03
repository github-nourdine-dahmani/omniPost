import { getJobsBy } from "@/lib/job";
import { JobType, JobStatus } from "@prisma/client";

import PageClient from './page-client';

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Top News",
    description: "Latest Top News",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Seeds() {

    const jobs = await getJobsBy({
        jobType: null,
        jobStatus: JobStatus.COMPLETED
    });

    return (
        <>
            <PageClient jobs={jobs} />
        </>
    );
}
