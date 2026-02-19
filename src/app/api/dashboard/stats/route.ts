import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth"; // Re-use connection/config

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Get authenticated user
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId, role } = (session as any).user;

    // Allow both EMPLOYER and ADMIN
    if (role !== 'EMPLOYER' && role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        let activeJobsCount, totalApplicants, recentJobs;

        if (role === 'ADMIN') {
            // Admin sees GLOBAL stats
            activeJobsCount = await prisma.job.count({
                where: { status: 'Active' }
            });

            // Count total applications across ALL jobs
            totalApplicants = await prisma.application.count();

            // Recent jobs from ALL employers
            recentJobs = await prisma.job.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    _count: { select: { applications: true } },
                    employer: { select: { name: true } } // Include employer name for admin
                }
            });

        } else {
            // Employer sees OWN stats
            activeJobsCount = await prisma.job.count({
                where: { employerId: userId, status: 'Active' }
            });

            const jobsWithApps = await prisma.job.findMany({
                where: { employerId: userId },
                include: { _count: { select: { applications: true } } }
            });

            totalApplicants = jobsWithApps.reduce((acc: number, job) => acc + job._count.applications, 0);

            recentJobs = await prisma.job.findMany({
                where: { employerId: userId },
                orderBy: { createdAt: 'desc' },
                take: 3,
                include: { _count: { select: { applications: true } } }
            });
        }

        return NextResponse.json({
            stats: {
                activeJobs: activeJobsCount,
                totalApplicants,
                shortlisted: 0 // Placeholder
            },
            recentJobs
        });


        return NextResponse.json({
            stats: {
                activeJobs: activeJobsCount,
                totalApplicants,
                shortlisted: 0 // Placeholder logic for now
            },
            recentJobs
        });
    } catch (error) {
        return NextResponse.json({ error: 'Data fetch failed', details: String(error) }, { status: 500 });
    }
}
