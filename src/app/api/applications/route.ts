import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendJobApplicationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = ((session as any).user as any).id;
        const role = ((session as any).user as any).role;

        let whereClause = {};

        if (role === 'EMPLOYER') {
            // Get applications for jobs posted by this employer
            // Simple way: Find jobs by this employer, then apps for those jobs
            const jobs = await prisma.job.findMany({ where: { employerId: userId }, select: { id: true } });
            const jobIds = jobs.map(j => j.id);
            whereClause = { jobId: { in: jobIds } };
        } else if (role === 'ADMIN') {
            // Admin sees all? Or maybe just keep it empty for now
            whereClause = {};
        } else {
            // Candidate sees their own applications
            whereClause = { applicantId: userId };
        }

        const applications = await prisma.application.findMany({
            where: whereClause,
            include: {
                job: {
                    select: { 
                        id: true, 
                        title: true,
                        companyName: true,
                        employer: {
                            select: { name: true }
                        }
                    }
                },
                applicant: {
                    select: {
                        name: true,
                        email: true,
                        studentProfile: {
                            select: {
                                photoUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { jobId, resumeUrl, answers } = body;

        // Check if already applied
        const existing = await prisma.application.findFirst({
            where: {
                jobId: jobId,
                applicantId: ((session as any).user as any).id
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'Already applied' }, { status: 400 });
        }

        // Get applicant details for redundant storage if needed, or rely on relation
        const user = await prisma.user.findUnique({ where: { id: ((session as any).user as any).id } });

        const application = await prisma.application.create({
            data: {
                jobId,
                applicantId: ((session as any).user as any).id,
                status: 'Applied',
                name: user?.name || "Unknown Candidate",
                email: user?.email || "No Email",
                resumeUrl: resumeUrl || user?.resumeUrl,
                answers: answers
            },
            include: {
                job: {
                    include: {
                        employer: true
                    }
                }
            }
        });

        // Send confirmation email
        if (user?.email) {
            await sendJobApplicationEmail(
                user.email,
                user.name || "Candidate",
                application.job.title,
                application.job.employer.companyName || "Shark Edutech Partner"
            );
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error("Application submission error:", error);
        // @ts-ignore
        return NextResponse.json({ error: 'Failed to apply', details: error.message }, { status: 500 });
    }
}
