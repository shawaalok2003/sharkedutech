import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const college = await prisma.college.findUnique({
        where: { id },
        include: {
            courses: true,
            requirements: true,
            photos: true
        }
    });

    if (!college) {
        return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "EMPLOYER" && role !== "COLLEGE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const updated = await prisma.college.update({
            where: { id },
            data: {
                name: body.name,
                location: body.location,
                description: body.description,
                website: body.website,
                email: body.email,
                phone: body.phone,
                address: body.address,
                rating: body.rating ? Number(body.rating) : undefined,
                logoUrl: body.logoUrl,
                establishedYear: body.establishedYear ? Number(body.establishedYear) : undefined,
                accreditation: body.accreditation,
                affiliation: body.affiliation,
                ranking: body.ranking,
                campusArea: body.campusArea,
                hostelAvailable: body.hostelAvailable ?? undefined,
                placementRate: body.placementRate,
                avgPackage: body.avgPackage,
                topRecruiters: body.topRecruiters,
                admissionProcess: body.admissionProcess,
                eligibility: body.eligibility,
                scholarships: body.scholarships,
                facilities: body.facilities,
                brochureUrl: body.brochureUrl,
                applicationFee: body.applicationFee ? Number(body.applicationFee) : undefined,
                totalSeats: body.totalSeats ? Number(body.totalSeats) : undefined
            }
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        console.error("❌ PUT college error:", err);
        return NextResponse.json({ error: err.message || "Failed to update college" }, { status: 500 });
    }
}
