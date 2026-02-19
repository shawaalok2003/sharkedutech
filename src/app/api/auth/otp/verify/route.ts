import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashOTP, isOTPExpired } from '@/lib/otp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { email: rawEmail, code: rawCode } = await request.json();
        const email = rawEmail?.trim().toLowerCase();
        const code = rawCode?.trim();

        console.log(`🔍 Attempting to verify OTP for: "${email}" (Raw: "${rawEmail}"), Code: "${code}" (Raw: "${rawCode}")`);

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and verification code are required' },
                { status: 400 }
            );
        }

        const hashedCode = hashOTP(code);

        const otpRecord = await prisma.otp.findFirst({
            where: {
                email,
                code: hashedCode,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!otpRecord) {
            console.log(`❌ No OTP found for "${email}" with matching hash.`);
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            );
        }

        if (otpRecord.verified) {
            console.log(`⚠️ OTP for "${email}" already verified.`);
            // If it's already verified, we can still allow them to proceed to Step 3
            // because this means they might have had a network glitch after verification.
        } else {
            if (isOTPExpired(otpRecord.expiresAt)) {
                return NextResponse.json(
                    { error: 'Verification code has expired' },
                    { status: 400 }
                );
            }

            // Mark OTP as verified
            await prisma.otp.update({
                where: { id: otpRecord.id },
                data: { verified: true },
            });
            console.log(`✅ OTP verified for ${email}`);
        }

        // Sync user with database
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create user if they don't exist
            // If No user exists, we assume they are signing up as CANDIDATE by default 
            // unless we start passing role here too.
            user = await prisma.user.create({
                data: {
                    email,
                    password: '', // Passwordless user
                    role: 'CANDIDATE', // Default role for new OTP users
                },
            });
            console.log(`✅ Created new user via SMTP OTP: ${email}`);
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
