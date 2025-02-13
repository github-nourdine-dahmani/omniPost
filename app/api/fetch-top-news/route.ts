import { NextResponse } from 'next/server';
import {createJob, runJob} from '@/lib/job';
import { JobType } from "@prisma/client";

export async function GET() {
    try {
        const job = await createJob(JobType.FETCH_TOP_NEWS);

        const result = await runJob(job);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching top news:', error);
        
        return NextResponse.json({
            error: `Failed to fetch top news: ${error}`
        }, { status: 500 });
    }
}