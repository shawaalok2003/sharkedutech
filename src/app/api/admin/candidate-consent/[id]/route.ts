import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";
import { sendConsentFormStatusEmail } from '@/lib/email';

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const body = await request.json();
        const { status, adminRemarks } = body;

        const previous = await prisma.candidateConsentForm.findUnique({
            where: { id }
        });

        if (!previous) {
            return NextResponse.json({ error: 'Consent form record not found' }, { status: 404 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (adminRemarks !== undefined) updateData.adminRemarks = adminRemarks;

        const updated = await prisma.candidateConsentForm.update({
            where: { id },
            data: updateData
        });

        // Dispatch status notification email to candidate if status is updated
        if (status && status !== previous.status && updated.email) {
            sendConsentFormStatusEmail({
                candidateName: updated.fullName,
                candidateEmail: updated.email,
                referenceCode: `SHARK-CF-${updated.id.slice(-6).toUpperCase()}`,
                status: updated.status as any,
                adminRemarks: updated.adminRemarks
            }).catch(err => console.error('Failed to dispatch candidate status update email:', err));
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating consent form:', error);
        return NextResponse.json({ error: 'Failed to update consent form' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        await prisma.candidateConsentForm.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting consent form:', error);
        return NextResponse.json({ error: 'Failed to delete consent form' }, { status: 500 });
    }
}
