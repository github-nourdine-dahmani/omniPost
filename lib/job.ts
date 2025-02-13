"use server";

import { PrismaClient, Job, JobStatus, JobType } from "@prisma/client";
import { fetchTopNews } from "@/lib/worldnewsapi";

const prisma = new PrismaClient();

// Utility function to transform Prisma job to Job type
// function transformJob(prismaJob: (PrismaJob & { articles?: Article[] }) | null): Job | null {
//     if (!prismaJob) return null;

//     return {
//         id: prismaJob.id,
//         type: parseJobType(prismaJob.type),
//         params: prismaJob.params,
//         data: prismaJob.data,
//         status: parseJobStatus(prismaJob.status),
//         createdAt: prismaJob.createdAt
//     };
// }

export async function createJob(jobType: JobType): Promise<Job> {
    const latestJob = await getLatestJob(jobType);

    if (latestJob && latestJob.status === JobStatus.PENDING) {
        throw new Error('Last job still pending');
    }

    if (latestJob && 
        latestJob.status === JobStatus.COMPLETED && 
        latestJob.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        throw new Error('Last completed job too recent');
    }

    const job = await prisma.job.create({
        data: {
            type: jobType,
            status: JobStatus.READY,
        }
    });

    return job;
}

export async function runJob(job: Job): Promise<Job> {
    if (job.status !== JobStatus.READY) {
        throw new Error('Job not ready');
    }   

    await updateJobStatus(job, JobStatus.RUNNING);

    let data: any = null;

    try {
        switch (job.type) {
            case JobType.FETCH_TOP_NEWS:
            case JobType.REFINE_ARTICLE:
                data = await fetchTopNews();
                break;
            default:
                throw new Error(`Invalid job type: ${job.type}`);
        }
    } catch (error) {
        await updateJobStatus(job, JobStatus.FAILED);
        console.error(`Job ${job.id} failed:`, error);
    }

    return updateJobStatus(job, JobStatus.COMPLETED, data ? JSON.stringify(data) : null);
}

export async function updateJobStatus(job: Job, status: JobStatus, data: string | null = null): Promise<Job> {
    const result = await prisma.job.update({
        where: { id: job.id },
        data: { status, data }
    });

    return result;
}


export async function getAllJobs(jobType: JobType): Promise<Job[]> {
    const results = await prisma.job.findMany({
        where: { type: jobType },
        include: { articles: true }
    });

    return results;
}

export async function getJob(jobId: number): Promise<Job | null> {
    const result = await prisma.job.findUnique({
        where: { id: jobId },
        include: { articles: true }
    });

    return result;
}

export async function getLatestJob(
    jobType: JobType, 
    jobStatus: JobStatus = JobStatus.COMPLETED
): Promise<Job | null> {
    console.log('getLatestJob', jobType, jobStatus);
    const result = await prisma.job.findFirst({
        where: {
            type: jobType,
            status: jobStatus,
        },
        include: { articles: true }
    });

    console.log('getLatestJob result', result);

    return result;
}
