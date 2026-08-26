import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
        return NextResponse.json({ error: 'Token and email are required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
                inviteToken: token,
                role: 'ADMIN'
            },
            select: {
                id: true,
                email: true,
                name: true,
                adminPermissions: true,
                isInviteAccepted: true,
                inviteTokenExpires: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired admin invitation token' }, { status: 404 });
        }

        if (user.inviteTokenExpires && new Date() > user.inviteTokenExpires) {
            return NextResponse.json({ error: 'Invitation token has expired' }, { status: 400 });
        }

        return NextResponse.json({
            valid: true,
            user
        });
    } catch (error) {
        console.error("Verify admin token error:", error);
        return NextResponse.json({ error: 'Failed to verify admin invitation' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, email, password } = body;

        if (!token || !email) {
            return NextResponse.json({ error: 'Token and email are required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
                inviteToken: token,
                role: 'ADMIN'
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired admin invitation token' }, { status: 404 });
        }

        const updateData: any = {
            isInviteAccepted: true,
            inviteToken: null
        };

        if (password && password.trim().length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            message: 'Admin access verified & activated successfully. You may now log in.'
        });
    } catch (error) {
        console.error("Activate admin error:", error);
        return NextResponse.json({ error: 'Failed to activate admin access' }, { status: 500 });
    }
}
