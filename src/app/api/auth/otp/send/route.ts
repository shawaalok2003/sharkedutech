import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, getOTPExpiry, hashOTP } from '@/lib/otp';
import { sendOTP, formatPhoneNumber, validatePhoneNumber } from '@/lib/twilio';

// Rate limiting: Store in memory (use Redis in production)
const otpRequests = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(phone: string): boolean {
    const now = Date.now();
    const limit = otpRequests.get(phone);

    if (!limit || now > limit.resetAt) {
        // Reset or create new limit
        otpRequests.set(phone, { count: 1, resetAt: now + 5 * 60 * 1000 }); // 5 minutes
        return true;
    }

    if (limit.count >= 3) {
        return false; // Rate limited
    }

    limit.count++;
    return true;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone } = body;

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // Validate phone number
        if (!validatePhoneNumber(phone)) {
            return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
        }

        const formattedPhone = formatPhoneNumber(phone);

        // Check rate limit
        if (!checkRateLimit(formattedPhone)) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again in 5 minutes.' },
                { status: 429 }
            );
        }

        // Generate OTP
        const code = generateOTP();
        const hashedCode = hashOTP(code);
        const expiresAt = getOTPExpiry();

        // Invalidate previous OTPs for this phone
        await prisma.oTP.updateMany({
            where: {
                phone: formattedPhone,
                verified: false,
            },
            data: {
                verified: true, // Mark as used/invalid
            },
        });

        // Store OTP in database
        await prisma.oTP.create({
            data: {
                phone: formattedPhone,
                code: hashedCode,
                expiresAt,
            },
        });

        // Send OTP via Twilio
        const sent = await sendOTP(formattedPhone, code);

        if (!sent) {
            return NextResponse.json(
                { error: 'Failed to send OTP. Please check your phone number.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            expiresIn: 300, // 5 minutes in seconds
        });
    } catch (error) {
        console.error('OTP send error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
