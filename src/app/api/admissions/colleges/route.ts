import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let serverCollegesCache: { data: any; timestamp: number } | null = null;

export async function GET() {
    const session = await getServerSession(authOptions);
    const role = session ? (session.user as any).role : null;

    // Cache hit for general public colleges request (<15s old)
    if (!role && serverCollegesCache && (Date.now() - serverCollegesCache.timestamp < 15000)) {
        return NextResponse.json(serverCollegesCache.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59'
            }
        });
    }

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

    const result = colleges.map(college => ({
        ...college,
        courseCount: college.courses.length
    }));

    if (!role) {
        serverCollegesCache = { data: result, timestamp: Date.now() };
    }

    return NextResponse.json(result, {
        headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59'
        }
    });
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
