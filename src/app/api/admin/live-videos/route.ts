import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/videoUtils';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const where: any = {};
        if (status && status !== 'ALL') {
            if (status === 'LIVE_NOW') {
                where.isLiveNow = true;
            } else {
                where.status = status;
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { speakerName: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } }
            ];
        }

        const videos = await prisma.liveVideo.findMany({
            where,
            orderBy: [
                { isLiveNow: 'desc' },
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        const totalCount = await prisma.liveVideo.count();
        const liveNowCount = await prisma.liveVideo.count({ where: { isLiveNow: true } });
        const upcomingCount = await prisma.liveVideo.count({ where: { status: 'UPCOMING' } });
        const recordedCount = await prisma.liveVideo.count({ where: { status: 'RECORDED' } });

        return NextResponse.json({
            videos,
            stats: {
                total: totalCount,
                liveNow: liveNowCount,
                upcoming: upcomingCount,
                recorded: recordedCount
            }
        });
    } catch (error) {
        console.error('Error fetching live videos for admin:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            title,
            description,
            category = 'Live Session',
            videoType = 'YOUTUBE',
            youtubeUrl,
            videoUrl,
            thumbnailUrl,
            status = 'RECORDED',
            isLiveNow = false,
            isFeatured = true,
            scheduledAt,
            duration,
            speakerName,
            speakerTitle
        } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Parse YouTube ID if YouTube URL or ID provided
        let parsedYouTubeId = null;
        let finalThumbnail = thumbnailUrl ? thumbnailUrl.trim() : null;

        if (videoType === 'YOUTUBE' && youtubeUrl) {
            parsedYouTubeId = extractYouTubeId(youtubeUrl);
            if (!parsedYouTubeId && youtubeUrl.trim()) {
                // If it looks like user entered just an ID
                if (/^[a-zA-Z0-9_-]{11}$/.test(youtubeUrl.trim())) {
                    parsedYouTubeId = youtubeUrl.trim();
                }
            }

            // Auto-generate thumbnail from YouTube if not custom specified
            if (parsedYouTubeId && !finalThumbnail) {
                finalThumbnail = getYouTubeThumbnail(parsedYouTubeId, 'max');
            }
        }

        // Determine final isLiveNow
        const activeLiveNow = Boolean(isLiveNow) || status === 'LIVE_NOW';
        const finalStatus = activeLiveNow ? 'LIVE_NOW' : status;

        const newVideo = await prisma.liveVideo.create({
            data: {
                title: title.trim(),
                description: description ? description.trim() : null,
                category: category || 'Live Session',
                videoType: videoType || 'YOUTUBE',
                youtubeUrl: youtubeUrl ? youtubeUrl.trim() : null,
                youtubeId: parsedYouTubeId,
                videoUrl: videoUrl ? videoUrl.trim() : null,
                thumbnailUrl: finalThumbnail,
                status: finalStatus,
                isLiveNow: activeLiveNow,
                isFeatured: Boolean(isFeatured),
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                duration: duration ? duration.trim() : null,
                speakerName: speakerName ? speakerName.trim() : null,
                speakerTitle: speakerTitle ? speakerTitle.trim() : null
            }
        });

        return NextResponse.json({
            success: true,
            video: newVideo,
            message: activeLiveNow ? 'Live stream started and published to landing page!' : 'Video recorded and published successfully!'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating live video:', error);
        return NextResponse.json({ error: 'Failed to create video record' }, { status: 500 });
    }
}
