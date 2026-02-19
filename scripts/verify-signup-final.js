const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function verifyIntegratedSignup() {
    console.log('--- Final Integrated Signup Verification ---');
    const testEmail = 'signup_verify_' + Date.now() + '@example.com';
    const testPassword = 'Password123!';
    const testName = 'Test User';

    try {
        // 1. Manually create a verified OTP record to simulate successful verification
        console.log('1. Mocking verified OTP for:', testEmail);
        await prisma.otp.create({
            data: {
                email: testEmail,
                code: 'MOCKED', // doesn't matter for this direct test
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                verified: true
            }
        });

        // 2. Mock the user being "partially created" by verification (as /api/auth/otp/verify does)
        console.log('2. Mocking partial user record...');
        await prisma.user.create({
            data: {
                email: testEmail,
                password: '', // Passwordless
                role: 'CANDIDATE'
            }
        });

        // 3. Call the Signup API (final step)
        console.log('3. Calling Signup API to finalize profile...');
        const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                name: testName,
                role: 'CANDIDATE'
            }),
        });

        const signupData = await signupRes.json();
        console.log('Signup API Response:', signupData);

        if (signupRes.ok) {
            console.log('✅ Signup API successful');

            // 4. Verify user record in database
            const user = await prisma.user.findUnique({ where: { email: testEmail } });
            if (user && user.password && user.name === testName) {
                console.log('✅ Database verification successful: User profile finalized.');
            } else {
                console.log('❌ Database verification failed.');
            }
        } else {
            console.log('❌ Signup API failed:', signupData.error);
        }

    } catch (err) {
        console.error('Error during verification:', err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyIntegratedSignup();
