import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, newPassword, token } = await request.json();

        if (!newPassword) {
            return NextResponse.json({ error: 'New password is required' }, { status: 400 });
        }

        let user;

        if (token) {
            // Find by token
            user = await prisma.user.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpires: { gt: new Date() }
                },
            });
            if (!user) {
                return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
            }
        } else {
            // Find by email (manual reset)
            if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
            user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { 
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            },
        });

        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
