import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const password = await bcrypt.hash('password123', 10);

        // Create Admin
        const admin = await prisma.user.upsert({
            where: { email: 'admin@shark.com' },
            update: {},
            create: {
                email: 'admin@shark.com',
                name: 'Admin User',
                password,
                role: 'ADMIN',
            },
        });

        // Create Employer
        const employer = await prisma.user.upsert({
            where: { email: 'employer@shark.com' },
            update: {},
            create: {
                email: 'employer@shark.com',
                name: 'Employer User',
                password,
                role: 'EMPLOYER',
            },
        });

        return NextResponse.json({
            message: 'Database seeded successfully',
            users: { admin: admin.email, employer: employer.email }
        });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 });
    }
}
