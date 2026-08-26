import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendAdminInviteEmail } from "@/lib/email";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const subAdmins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                adminPermissions: true,
                isInviteAccepted: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(subAdmins);
    } catch (error) {
        console.error("Sub-admins fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch sub-admins' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only Super Admin can assign sub-admin access' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { email, name, permissions } = body;

        if (!email || !Array.isArray(permissions) || permissions.length === 0) {
            return NextResponse.json({ error: 'Email and at least one permission are required' }, { status: 400 });
        }

        const permString = permissions.join(',');
        const inviteToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Check if user already exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update existing user to ADMIN role with assigned permissions
            user = await prisma.user.update({
                where: { email },
                data: {
                    role: 'ADMIN',
                    adminPermissions: permString,
                    inviteToken,
                    inviteTokenExpires: tokenExpires,
                    isInviteAccepted: false,
                    name: name || user.name
                }
            });
        } else {
            // Create new pending admin user
            const tempPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    password: tempPassword,
                    role: 'ADMIN',
                    adminPermissions: permString,
                    inviteToken,
                    inviteTokenExpires: tokenExpires,
                    isInviteAccepted: false
                }
            });
        }

        // Send Verification & Access Email
        const inviterName = session.user.name || session.user.email || 'Super Admin';
        await sendAdminInviteEmail(email, permissions, inviteToken, inviterName);

        return NextResponse.json({
            message: `Admin access granted to ${email}. Verification email sent successfully.`,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                permissions: user.adminPermissions,
                isInviteAccepted: user.isInviteAccepted
            }
        });
    } catch (error) {
        console.error("Grant admin access error:", error);
        return NextResponse.json({ error: 'Failed to grant admin access' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Sub-admin ID required' }, { status: 400 });
        }

        // Revoke admin permissions
        await prisma.user.update({
            where: { id },
            data: {
                role: 'CANDIDATE',
                adminPermissions: null,
                inviteToken: null
            }
        });

        return NextResponse.json({ message: 'Admin access revoked successfully' });
    } catch (error) {
        console.error("Revoke admin access error:", error);
        return NextResponse.json({ error: 'Failed to revoke admin access' }, { status: 500 });
    }
}
