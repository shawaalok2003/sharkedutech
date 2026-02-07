import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, getOTPExpiry, hashOTP } from '@/lib/otp';
import { sendEmailOTP, validateEmail } from '@/lib/email';

// Rate limiting: Store in memory (use Redis in production)
const otpRequests = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const limit = otpRequests.get(identifier);

    if (!limit || now > limit.resetAt) {
        otpRequests.set(identifier, { count: 1, resetAt: now + 5 * 60 * 1000 });
        return true;
    }

    if (limit.count >= 3) {
        return false;
    }

    limit.count++;
    return true;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Validate email
        if (!validateEmail(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Check rate limit
        if (!checkRateLimit(email)) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again in 5 minutes.' },
                { status: 429 }
            );
        }

        // Generate OTP
        const code = generateOTP();
        const hashedCode = hashOTP(code);
        const expiresAt = getOTPExpiry();

        // Invalidate previous OTPs for this email
        await prisma.oTP.updateMany({
            where: {
                phone: email, // Reusing phone field for email
                verified: false,
            },
            data: {
                verified: true,
            },
        });

        // Store OTP in database
        await prisma.oTP.create({
            data: {
                phone: email, // Reusing phone field for email
                code: hashedCode,
                expiresAt,
            },
        });

        // Send OTP via Email
        const sent = await sendEmailOTP(email, code);

        if (!sent) {
            return NextResponse.json(
                { error: 'Failed to send OTP email. Please check your email address.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email',
            expiresIn: 300,
        });
    } catch (error) {
        console.error('Email OTP send error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
