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
        // Fetch applications where the job's employerId matches current user
        const applications = await prisma.application.findMany({
            where: {
                job: {
                    employerId: userId
                }
            },
            include: {
                job: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch applications', details: String(error) }, { status: 500 });
    }
}
