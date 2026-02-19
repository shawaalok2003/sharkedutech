import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const collegeIdParam = searchParams.get("collegeId") || undefined;

    let collegeId = collegeIdParam;
    if (!collegeId && session) {
        const role = (session.user as any).role;
        if (role === "COLLEGE" || role === "EMPLOYER") {
            const college = await prisma.college.findFirst({
                where: { adminId: ((session as any).user as any).id },
                select: { id: true }
            });
            collegeId = college?.id;
        }
    }

    if (!collegeId) {
        return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }

    const requirements = await prisma.admissionRequirement.findMany({
        where: { collegeId },
        orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(requirements);
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
    const { collegeId: collegeIdParam, name, description, required } = body;

    let collegeId = collegeIdParam as string | undefined;
    if (!collegeId && (role === "EMPLOYER" || role === "COLLEGE")) {
        const college = await prisma.college.findFirst({
            where: { adminId: ((session as any).user as any).id },
            select: { id: true }
        });
        collegeId = college?.id;
    }

    if (!collegeId || !name) {
        return NextResponse.json({ error: "collegeId and name are required" }, { status: 400 });
    }

    const requirement = await prisma.admissionRequirement.create({
        data: {
            collegeId,
            name,
            description,
            required: required ?? true
        }
    });

    return NextResponse.json(requirement);
}
