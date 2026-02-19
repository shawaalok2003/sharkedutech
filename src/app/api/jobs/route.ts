import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Build query based on status/filters
    const where: any = {};
    if (type) where.type = type;

    try {
        const jobs = await prisma.job.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                employer: {
                    select: { name: true, email: true }
                }
            }
        });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Optional: Check if user is employer or admin
    // if (session.user.role !== 'EMPLOYER' && session.user.role !== 'ADMIN') { ... }

    try {
        const body = await request.json();
        const { title, type, location, salaryMin, salaryMax, description, requirements } = body;

        const job = await prisma.job.create({
            data: {
                title,
                type,
                location,
                salaryMin: Number(salaryMin),
                salaryMax: Number(salaryMax),
                description,
                requirements,
                employerId: ((session as any).user as any).id,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error("Job creation error:", error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}
