import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
        where: { userId: ((session as any).user as any).id }
    });

    return NextResponse.json(profile || {});
}


export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, dob, city, address, bio, education, photoUrl } = body;

    const profile = await prisma.studentProfile.upsert({
        where: { userId: ((session as any).user as any).id },
        update: {
            phone,
            dob: dob ? new Date(dob) : null,
            city,
            address,
            bio,
            education,
            photoUrl
        },
        create: {
            userId: ((session as any).user as any).id,
            phone,
            dob: dob ? new Date(dob) : null,
            city,
            address,
            bio,
            education,
            photoUrl
        }
    });

    return NextResponse.json(profile);
}
