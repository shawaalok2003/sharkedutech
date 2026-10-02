import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role, companyName, industry } = body;

        if (!email || !password || !name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUser) {
            // Check if user was assigned/invited as an ADMIN and is now signing up to activate their account
            if (existingUser.role === 'ADMIN' && !existingUser.isInviteAccepted) {
                const user = await prisma.user.update({
                    where: { email },
                    data: {
                        name: name || existingUser.name,
                        password: hashedPassword,
                        role: 'ADMIN',
                        isInviteAccepted: true,
                        inviteToken: null,
                        inviteTokenExpires: null,
                    },
                });
                return NextResponse.json({ 
                    message: 'Admin account registered and activated successfully', 
                    userId: user.id,
                    role: 'ADMIN' 
                });
            }

            // If user exists and is active with a password, they are truly already registered
            if (existingUser.password && existingUser.isInviteAccepted !== false) {
                if (existingUser.role !== role && role !== 'ADMIN') {
                    return NextResponse.json({ error: `This email is already linked to a ${existingUser.role.toLowerCase()} account. You cannot use it for a ${role.toLowerCase()} account.` }, { status: 400 });
                }
                return NextResponse.json({ error: 'User already exists. Please sign in with your password.' }, { status: 400 });
            }

            // User was created via OTP but hasn't set a password/profile yet
            const user = await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashedPassword,
                    role: existingUser.role === 'ADMIN' ? 'ADMIN' : role,
                    isInviteAccepted: true,
                    ...(role === 'EMPLOYER' ? {
                        companyName,
                        industry
                    } : {})
                },
            });
            return NextResponse.json({ message: 'User updated successfully', userId: user.id, role: user.role });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role,
                isInviteAccepted: true,
                ...(role === 'ADMIN' ? {
                    adminPermissions: 'manage_videos'
                } : {}),
                ...(role === 'EMPLOYER' ? {
                    companyName,
                    industry
                } : {})
            },
        });

        return NextResponse.json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}
