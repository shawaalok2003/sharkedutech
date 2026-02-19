import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user || ((session as any).user as any).role !== 'EMPLOYER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = ((session as any).user as any).id;

    try {
        const jobs = await prisma.job.findMany({
            where: { employerId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { applications: true } }
            }
        });

        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch jobs', details: String(error) }, { status: 500 });
    }
}
