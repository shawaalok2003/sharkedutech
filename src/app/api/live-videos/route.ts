import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get('limit')) || 20;

        const videos = await prisma.liveVideo.findMany({
            where: { isFeatured: true },
            orderBy: [
                { isLiveNow: 'desc' },
                { order: 'asc' },
                { createdAt: 'desc' }
            ],
            take: limit
        });

        const hasLiveNow = videos ? videos.some(v => v.isLiveNow) : false;

        return NextResponse.json({
            success: true,
            videos: videos || [],
            hasLiveNow
        });
    } catch (error) {
        console.error('Error fetching live videos:', error);
        return NextResponse.json({
            success: true,
            videos: [],
            hasLiveNow: false
        });
    }
}
