import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, getOTPExpiry, hashOTP } from '@/lib/otp';
import { sendEmailOTP } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { email: rawEmail, role: intendedRole } = await request.json();
        const email = rawEmail?.trim().toLowerCase();

        console.log(`📩 Request to send OTP for: "${email}" (Intended Role: ${intendedRole})`);

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if user exists with a different role
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser && intendedRole && existingUser.role !== intendedRole) {
            // Special Case: Allow Candidates to be checked against their role
            // But if they are an EMPLOYER trying to login as CANDIDATE, block it.
            return NextResponse.json(
                { error: `This email is already registered as a ${existingUser.role}. Please use the correct login portal.` },
                { status: 400 }
            );
        }

        // Generate OTP
        const code = generateOTP();
        const expiresAt = getOTPExpiry();
        const hashedCode = hashOTP(code);

        // Store OTP in database
        await prisma.otp.create({
            data: {
                email,
                code: hashedCode,
                expiresAt,
            },
        });

        // Send OTP via SMTP
        const sent = await sendEmailOTP(email, code);

        // For development, if SMTP is not configured, we still return success but log to console
        if (!sent && process.env.NODE_ENV === 'development') {
            console.log(`🧪 [DEV MODE] SMTP OTP for ${email}: ${code}`);
            return NextResponse.json({
                success: true,
                message: 'OTP logged to console (SMTP not configured)'
            });
        }

        if (!sent) {
            return NextResponse.json(
                { error: 'Failed to send OTP. Please check SMTP configuration.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
