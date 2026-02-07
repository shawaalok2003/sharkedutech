import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOTP, isOTPExpired } from '@/lib/otp';
import { formatPhoneNumber } from '@/lib/twilio';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';

const MAX_ATTEMPTS = 3;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, code } = body;

        if (!phone || !code) {
            return NextResponse.json(
                { error: 'Phone number and OTP code are required' },
                { status: 400 }
            );
        }

        const formattedPhone = formatPhoneNumber(phone);

        // Find the latest unverified OTP for this phone
        const otpRecord = await prisma.oTP.findFirst({
            where: {
                phone: formattedPhone,
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
            where: { phone: formattedPhone },
        });

        if (!user) {
            // Create new user with phone number
            user = await prisma.user.create({
                data: {
                    phone: formattedPhone,
                    phoneVerified: true,
                    email: `${formattedPhone.replace('+', '')}@temp.sharkedutech.com`, // Temporary email
                    password: '', // No password for OTP users
                    role: 'CANDIDATE', // Default role
                },
            });
        } else {
            // Update phone verification status
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    phoneVerified: true,
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
                phone: user.phone,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}
