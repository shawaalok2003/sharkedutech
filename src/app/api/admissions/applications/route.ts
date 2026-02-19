import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId") || undefined;

    if (role === "ADMIN" || role === "EMPLOYER" || role === "COLLEGE") {
        let where: any = collegeId ? { collegeId } : undefined;
        if (!collegeId && (role === "EMPLOYER" || role === "COLLEGE")) {
            const colleges = await prisma.college.findMany({
                where: { adminId: ((session as any).user as any).id },
                select: { id: true }
            });
            const ids = colleges.map(c => c.id);
            if (ids.length === 0) {
                return NextResponse.json([]);
            }
            where = { collegeId: { in: ids } };
        }
        const applications = await prisma.admissionApplication.findMany({
            where,
            include: {
                student: { select: { name: true, email: true } },
                course: { select: { title: true } },
                college: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(applications);
    }

    const applications = await prisma.admissionApplication.findMany({
        where: { studentId: ((session as any).user as any).id },
        include: {
            course: { select: { title: true } },
            college: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(applications);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
        collegeId,
        courseId,
        score,
        intakeYear,
        highestQualification,
        percentage,
        entranceExam,
        entranceScore,
        notes
    } = body;

    if (!collegeId) {
        return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
    }

    if (!intakeYear || !highestQualification || !percentage) {
        return NextResponse.json({ error: "intakeYear, highestQualification and percentage are required" }, { status: 400 });
    }

    const existing = await prisma.admissionApplication.findFirst({
        where: {
            studentId: ((session as any).user as any).id,
            collegeId,
            courseId: courseId || null
        }
    });

    if (existing) {
        return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    const application = await prisma.admissionApplication.create({
        data: {
            studentId: ((session as any).user as any).id,
            collegeId,
            courseId: courseId || null,
            status: "Pending",
            step: 1,
            score: score || null,
            intakeYear: intakeYear || null,
            highestQualification: highestQualification || null,
            percentage: percentage || null,
            entranceExam: entranceExam || null,
            entranceScore: entranceScore || null,
            notes: notes || null
        }
    });

    return NextResponse.json(application);
}
