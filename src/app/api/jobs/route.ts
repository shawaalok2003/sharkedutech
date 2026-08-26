import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let serverJobsCache: { data: any; timestamp: number } | null = null;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    // Return cached response instantly if cache is fresh (< 15 seconds) and no filter params
    if (!type && !category && serverJobsCache && (Date.now() - serverJobsCache.timestamp < 15000)) {
        return NextResponse.json(serverJobsCache.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59'
            }
        });
    }

    // Build query based on status/filters
    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;

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

        if (!type && !category) {
            serverJobsCache = { data: jobs, timestamp: Date.now() };
        }

        return NextResponse.json(jobs, {
            headers: {
                'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59'
            }
        });
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
        const { title, companyName, type, category, location, salaryMin, salaryMax, description, requirements } = body;

        const job = await prisma.job.create({
            data: {
                title,
                companyName,
                type,
                category: category || "Front Office",
                location,
                salaryMin: Number(salaryMin),
                salaryMax: Number(salaryMax),
                description,
                requirements,
                employerId: ((session as any).user as any).id,
            },
        });

        // Invalidate server cache on new job creation
        serverJobsCache = null;

        return NextResponse.json(job);
    } catch (error) {
        console.error("Job creation error:", error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}
