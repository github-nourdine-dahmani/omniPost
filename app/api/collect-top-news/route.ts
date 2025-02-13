import { NextResponse } from 'next/server';
import { getLatestJob } from '@/lib/job';
import { collectTopNews } from '@/lib/worldnewsapi';

import { JobType } from "@prisma/client";

export async function GET() {
    try {

        const latestJob = await getLatestJob(JobType.FETCH_TOP_NEWS);

        if (!latestJob) {
            return NextResponse.json({
                error: 'No top news job found'
            }, { status: 404 });
        }

        const articles = await collectTopNews(latestJob);
        return NextResponse.json(articles, { status: 200 });
    } catch (error) {
        console.error('Error fetching top news:', error);
        return NextResponse.json({
            error: 'Failed to fetch top news'
        }, { status: 500 });
    }
}