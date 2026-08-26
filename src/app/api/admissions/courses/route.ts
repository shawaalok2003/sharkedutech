import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let serverCoursesCache: { data: any; timestamp: number } | null = null;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId") || undefined;
    const session = await getServerSession(authOptions);
    const role = session ? (session.user as any).role : null;

    // Cache hit for general public courses request (<15s old)
    if (!collegeId && !role && serverCoursesCache && (Date.now() - serverCoursesCache.timestamp < 15000)) {
        return NextResponse.json(serverCoursesCache.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=59'
            }
        });
    }

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
        include: { college: { select: { name: true, location: true, logoUrl: true } } }
    });

    if (!collegeId && !role) {
        serverCoursesCache = { data: courses, timestamp: Date.now() };
    }

    return NextResponse.json(courses, {
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
