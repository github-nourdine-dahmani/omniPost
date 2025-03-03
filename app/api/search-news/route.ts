import { NextResponse } from 'next/server';
import {createJob, runJob} from '@/lib/job';
import { JobType } from "@prisma/client";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const force = (url.searchParams.get('force') || 'false') === 'true';
        
        const job = await createJob(JobType.SEARCH_NEWS, force);

        const result = await runJob(job);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching top news:', error);
        
        return NextResponse.json({
            error: `Failed to fetch top news: ${error}`
        }, { status: 500 });
    }
}