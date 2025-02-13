import { NextResponse } from 'next/server';
import { refineArticle } from '@/lib/article';

export async function GET() {
    try {
        const articles = await refineArticle();
        return NextResponse.json(articles, { status: 200 });
    } catch (error) {
        console.error('Error fetching top news:', error);
        return NextResponse.json({
            error: 'Failed to fetch top news'
        }, { status: 500 });
    }
}