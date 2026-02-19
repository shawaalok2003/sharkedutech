import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: applicationId } = await context.params;

    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: {
                    select: {
                        title: true,
                        type: true,
                        location: true,
                        employerId: true
                    }
                },
                applicant: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        skills: true,
                        education: true,
                        experience: true
                    }
                }
            }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Check authorization: either the applicant or the employer can view
        const userId = ((session as any).user as any).id;
        const isApplicant = application.applicantId === userId;
        const isEmployer = application.job.employerId === userId;

        if (!isApplicant && !isEmployer) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: applicationId } = await context.params;

    try {
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        // Verify the application exists and user is the employer
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: {
                    select: { employerId: true }
                }
            }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const userId = ((session as any).user as any).id;
        if (application.job.employerId !== userId) {
            return NextResponse.json({ error: 'Forbidden - Only employer can update status' }, { status: 403 });
        }

        // Update the application status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
            include: {
                job: {
                    select: { title: true }
                }
            }
        });

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
}
