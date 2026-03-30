import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> } // or { params: { id: string } } depending on precise types, but Promise is safe. Let's just use generic.
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
