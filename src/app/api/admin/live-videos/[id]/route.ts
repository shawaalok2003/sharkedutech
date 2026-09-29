import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/videoUtils';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const video = await prisma.liveVideo.findUnique({
            where: { id }
        });

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json({ video });
    } catch (error) {
        console.error('Error fetching live video:', error);
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const existing = await prisma.liveVideo.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const updateData: any = {};

        if (body.title !== undefined) updateData.title = String(body.title).trim();
        if (body.description !== undefined) updateData.description = body.description ? String(body.description).trim() : null;
        if (body.category !== undefined) updateData.category = String(body.category);
        if (body.videoType !== undefined) updateData.videoType = String(body.videoType);
        if (body.duration !== undefined) updateData.duration = body.duration ? String(body.duration).trim() : null;
        if (body.speakerName !== undefined) updateData.speakerName = body.speakerName ? String(body.speakerName).trim() : null;
        if (body.speakerTitle !== undefined) updateData.speakerTitle = body.speakerTitle ? String(body.speakerTitle).trim() : null;
        if (body.order !== undefined) updateData.order = Number(body.order);

        if (body.youtubeUrl !== undefined) {
            const url = body.youtubeUrl ? String(body.youtubeUrl).trim() : null;
            updateData.youtubeUrl = url;
            if (url) {
                const parsedId = extractYouTubeId(url);
                updateData.youtubeId = parsedId;
                if (!body.thumbnailUrl && parsedId) {
                    updateData.thumbnailUrl = getYouTubeThumbnail(parsedId, 'max');
                }
            } else {
                updateData.youtubeId = null;
            }
        }

        if (body.videoUrl !== undefined) {
            updateData.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null;
        }

        if (body.thumbnailUrl !== undefined) {
            updateData.thumbnailUrl = body.thumbnailUrl ? String(body.thumbnailUrl).trim() : null;
        }

        if (body.isFeatured !== undefined) {
            updateData.isFeatured = Boolean(body.isFeatured);
        }

        if (body.scheduledAt !== undefined) {
            updateData.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
        }

        // Live status updates
        if (body.isLiveNow !== undefined) {
            const liveNow = Boolean(body.isLiveNow);
            updateData.isLiveNow = liveNow;
            if (liveNow) {
                updateData.status = 'LIVE_NOW';
            } else if (existing.status === 'LIVE_NOW') {
                // When ending live, transition to RECORDED so replay video stays available
                updateData.status = 'RECORDED';
            }
        }

        if (body.status !== undefined) {
            updateData.status = body.status;
            if (body.status === 'LIVE_NOW') {
                updateData.isLiveNow = true;
            } else {
                updateData.isLiveNow = false;
            }
        }

        const updated = await prisma.liveVideo.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            video: updated,
            message: 'Video updated successfully'
        });
    } catch (error) {
        console.error('Error updating live video:', error);
        return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.liveVideo.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Video deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting live video:', error);
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }
}
