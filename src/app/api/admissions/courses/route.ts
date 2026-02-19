import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId") || undefined;
    const session = await getServerSession(authOptions);
    const role = session ? (session.user as any).role : null;

    let where: any = collegeId ? { collegeId } : undefined;

    if (!collegeId && (role === "EMPLOYER" || role === "COLLEGE")) {
        const colleges = await prisma.college.findMany({
            where: { adminId: session?.user.id },
            select: { id: true }
        });
        const ids = colleges.map(c => c.id);
        where = { collegeId: { in: ids } };
    }

    const courses = await prisma.course.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { college: { select: { name: true } } }
    });

    return NextResponse.json(courses);
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
        title,
        level,
        duration,
        seats,
        fee,
        status,
        description,
        collegeId,
        code,
        mode,
        eligibility,
        admissionCriteria,
        intakeMonth,
        applicationDeadline,
        syllabusUrl,
        scholarshipAvailable,
        placementSupport,
        feesBreakup
    } = body;

    if (!title || !collegeId) {
        return NextResponse.json({ error: "Title and collegeId are required" }, { status: 400 });
    }

    const course = await prisma.course.create({
        data: {
            title,
            level,
            duration,
            seats: seats ? Number(seats) : null,
            fee: fee ? Number(fee) : null,
            status: status || "Active",
            description,
            code,
            mode,
            eligibility,
            admissionCriteria,
            intakeMonth,
            applicationDeadline,
            syllabusUrl,
            scholarshipAvailable: scholarshipAvailable ?? false,
            placementSupport: placementSupport ?? false,
            feesBreakup,
            collegeId
        }
    });

    return NextResponse.json(course);
}
