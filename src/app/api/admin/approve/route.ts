import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions as any);
    if (!session || (session as any).user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const jobApps = await prisma.application.findMany({
            include: {
                job: { 
                    select: { 
                        title: true, 
                        employer: { select: { companyName: true } } 
                    } 
                },
                applicant: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const admissionApps = await prisma.admissionApplication.findMany({
            include: {
                college: { select: { name: true } },
                student: { select: { name: true, email: true } },
                course: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ jobApps, admissionApps });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions as any);
    if (!session || (session as any).user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { type, id, approved } = await request.json();

        if (type === 'JOB_APP') {
            await prisma.application.update({
                where: { id },
                data: { adminApproved: approved }
            });
        } else if (type === 'ADMISSION_APP') {
            await prisma.admissionApplication.update({
                where: { id },
                data: { adminApproved: approved }
            });
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update approval' }, { status: 500 });
    }
}
