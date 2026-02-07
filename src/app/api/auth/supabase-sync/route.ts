import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, supabaseId } = body;

        if (!email || !supabaseId) {
            return NextResponse.json(
                { error: 'Email and Supabase ID are required' },
                { status: 400 }
            );
        }

        // Check if user exists in Prisma database
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user in Prisma database
            user = await prisma.user.create({
                data: {
                    email,
                    password: '', // No password for Supabase OTP users
                    role: 'CANDIDATE', // Default role
                },
            });
            console.log(`✅ Created new user in Prisma: ${email}`);
        } else {
            console.log(`✅ User already exists in Prisma: ${email}`);
        }

        return NextResponse.json({
            success: true,
            email: user.email,
            role: user.role,
            id: user.id,
        });
    } catch (error) {
        console.error('Supabase sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync user data' },
            { status: 500 }
        );
    }
}
