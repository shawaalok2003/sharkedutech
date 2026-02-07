import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOTP, isOTPExpired } from '@/lib/otp';

const MAX_ATTEMPTS = 3;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and OTP code are required' },
                { status: 400 }
            );
        }

        // Find the latest unverified OTP for this email
        const otpRecord = await prisma.oTP.findFirst({
            where: {
                phone: email, // Reusing phone field for email
                verified: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: 'No OTP found. Please request a new one.' },
                { status: 404 }
            );
        }

        // Check if OTP is expired
        if (isOTPExpired(otpRecord.expiresAt)) {
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check max attempts
        if (otpRecord.attempts >= MAX_ATTEMPTS) {
            return NextResponse.json(
                { error: 'Maximum verification attempts exceeded. Please request a new OTP.' },
                { status: 400 }
            );
        }

        // Verify OTP
        const isValid = verifyOTP(code, otpRecord.code);

        // Increment attempts
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: {
                attempts: otpRecord.attempts + 1,
            },
        });

        if (!isValid) {
            const remainingAttempts = MAX_ATTEMPTS - (otpRecord.attempts + 1);
            return NextResponse.json(
                {
                    error: 'Invalid OTP code',
                    remainingAttempts: Math.max(0, remainingAttempts),
                },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: {
                verified: true,
            },
        });

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user with email
            user = await prisma.user.create({
                data: {
                    email,
                    password: '', // No password for OTP users
                    role: 'CANDIDATE',
                },
            });
        }

        // Link OTP to user
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: {
                userId: user.id,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Email OTP verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}
