import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = ((session as any).user as any).id; // Type-safe now

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                companyName: true,
                industry: true,
                size: true,
                website: true,
                description: true,
                address: true,
                email: true,
                name: true,
                // Candidate fields
                resumeUrl: true,
                phone: true,
                skills: true,
                education: true,
                experience: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = ((session as any).user as any).id;

    try {
        const body = await request.json();
        console.log("Profile Update Body:", body);

        // Destructure safely
        const {
            companyName, industry, size, website, description, address,
            name, phone, skills, resumeUrl, education, experience
        } = body;

        // Construct data object
        const updateData: any = {};
        if (companyName !== undefined) updateData.companyName = companyName;
        if (industry !== undefined) updateData.industry = industry;
        if (size !== undefined) updateData.size = size;
        if (website !== undefined) updateData.website = website;
        if (description !== undefined) updateData.description = description;
        if (address !== undefined) updateData.address = address;
        if (name !== undefined) updateData.name = name;

        // Candidate specific
        if (phone !== undefined) updateData.phone = phone;
        if (skills !== undefined) updateData.skills = skills;
        if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl;
        if (education !== undefined) updateData.education = education;
        if (experience !== undefined) updateData.experience = experience;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: 'Failed to update profile', details: String(error) }, { status: 500 });
    }
}
