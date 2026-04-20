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
            // If user exists and has a password, they are truly already registered
            if (existingUser.password) {
                if (existingUser.role !== role) {
                    return NextResponse.json({ error: `This email is already linked to a ${existingUser.role.toLowerCase()} account. You cannot use it for a ${role.toLowerCase()} account.` }, { status: 400 });
                }
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            }

            // User was created via OTP but hasn't set a password/profile yet
            const user = await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashedPassword,
                    role,
                    ...(role === 'EMPLOYER' ? {
                        companyName,
                        industry
                    } : {})
                },
            });
            return NextResponse.json({ message: 'User updated successfully', userId: user.id });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role,
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
