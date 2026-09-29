import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { receiptNumber: { contains: search, mode: 'insensitive' } },
                { qualification: { contains: search, mode: 'insensitive' } }
            ];
        }

        const forms = await prisma.candidateConsentForm.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        const totalCount = await prisma.candidateConsentForm.count();
        const pendingCount = await prisma.candidateConsentForm.count({ where: { status: 'Pending' } });
        const approvedCount = await prisma.candidateConsentForm.count({ where: { status: 'Approved' } });
        const conditionalCount = await prisma.candidateConsentForm.count({ where: { status: 'Conditional (Training Req.)' } });

        return NextResponse.json({
            forms,
            stats: {
                total: totalCount,
                pending: pendingCount,
                approved: approvedCount,
                conditional: conditionalCount
            }
        });
    } catch (error) {
        console.error('Error fetching consent forms:', error);
        return NextResponse.json({ error: 'Failed to fetch consent forms' }, { status: 500 });
    }
}
