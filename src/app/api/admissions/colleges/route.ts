import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    const role = session ? (session.user as any).role : null;

    const where = role === "EMPLOYER" || role === "COLLEGE"
        ? { adminId: session?.user.id }
        : undefined;

    const colleges = await prisma.college.findMany({
        where,
        include: {
            courses: { select: { id: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(colleges.map(college => ({
        ...college,
        courseCount: college.courses.length
    })));
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "EMPLOYER" && role !== "COLLEGE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
        name,
        location,
        description,
        website,
        email,
        phone,
        address,
        rating,
        logoUrl,
        establishedYear,
        accreditation,
        affiliation,
        ranking,
        campusArea,
        hostelAvailable,
        placementRate,
        avgPackage,
        topRecruiters,
        admissionProcess,
        eligibility,
        scholarships,
        facilities,
        brochureUrl,
        applicationFee,
        totalSeats
    } = body;

    if (!name || !location) {
        return NextResponse.json({ error: "Name and location are required" }, { status: 400 });
    }

    const college = await prisma.college.create({
        data: {
            name,
            location,
            description,
            website,
            email,
            phone,
            address,
            rating: rating ? Number(rating) : 0,
            logoUrl,
            establishedYear: establishedYear ? Number(establishedYear) : null,
            accreditation,
            affiliation,
            ranking,
            campusArea,
            hostelAvailable: hostelAvailable ?? false,
            placementRate,
            avgPackage,
            topRecruiters,
            admissionProcess,
            eligibility,
            scholarships,
            facilities,
            brochureUrl,
            applicationFee: applicationFee ? Number(applicationFee) : null,
            totalSeats: totalSeats ? Number(totalSeats) : null,
            adminId: ((session as any).user as any).id
        }
    });

    return NextResponse.json(college);
}
