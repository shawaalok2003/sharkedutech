import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { collegeName, location, contactPerson, officialEmail } = body;

        if (!collegeName || !location || !contactPerson || !officialEmail) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const inquiry = await prisma.collegePartnerInquiry.create({
            data: {
                collegeName,
                location,
                contactPerson,
                officialEmail,
            },
        });

        return NextResponse.json({ message: 'Inquiry submitted successfully', inquiry });
    } catch (error) {
        console.error('PARTNERSHIP_INQUIRY_ERROR:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const inquiries = await prisma.collegePartnerInquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(inquiries);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
