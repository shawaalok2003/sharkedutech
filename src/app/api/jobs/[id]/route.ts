import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                employer: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        const existingJob = await prisma.job.findUnique({
            where: { id }
        });

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (role !== 'ADMIN' && existingJob.employerId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                title: body.title !== undefined ? body.title : undefined,
                companyName: body.companyName !== undefined ? body.companyName : undefined,
                type: body.type !== undefined ? body.type : undefined,
                category: body.category !== undefined ? body.category : undefined,
                location: body.location !== undefined ? body.location : undefined,
                salaryMin: body.salaryMin ? Number(body.salaryMin) : null,
                salaryMax: body.salaryMax ? Number(body.salaryMax) : null,
                description: body.description !== undefined ? body.description : undefined,
                requirements: body.requirements !== undefined ? body.requirements : undefined,
                questions: body.questions !== undefined ? body.questions : undefined,
                status: body.status !== undefined ? body.status : undefined,
            }
        });

        return NextResponse.json(updatedJob);
    } catch (error: any) {
        console.error('Update job error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update job' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        const existingJob = await prisma.job.findUnique({
            where: { id }
        });

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (role !== 'ADMIN' && existingJob.employerId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.job.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete job error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete job' }, { status: 500 });
    }
}
