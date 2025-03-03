import { NextResponse } from 'next/server';
import {createJob, runJob} from '@/lib/job';
import { Transformation } from "@prisma/client";
import { process, getTransformation } from '@/lib/transformations';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const force = (url.searchParams.get('force') || 'false') === 'true';
        const transformationId = url.searchParams.get('transformation');

        if (!transformationId) {
            throw new Error('Transformation id is required');
        }

        const transformation = await getTransformation(parseInt(transformationId, 10));

        if (!transformation) {
            throw new Error('Transformation not found');
        }

        const processJob = await process(transformation);



        return NextResponse.json(processJob, { status: 200 });
    } catch (error) {
        console.error('Error fetching top news:', error);
        
        return NextResponse.json({
            error: `Failed to fetch top news: ${error}`
        }, { status: 500 });
    }
}