import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const application = await prisma.admissionApplication.findUnique({
        where: { id },
        include: {
            student: { select: { id: true, name: true, email: true } },
            course: { select: { title: true } },
            college: { select: { id: true, name: true, adminId: true } }
        }
    });

    if (!application) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const role = (session.user as any).role;
    if (application.studentId !== ((session as any).user as any).id && role !== "ADMIN" && role !== "EMPLOYER" && role !== "COLLEGE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if ((role === "EMPLOYER" || role === "COLLEGE") && application.college?.adminId !== ((session as any).user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [requirements, documents] = await Promise.all([
        prisma.admissionRequirement.findMany({
            where: { collegeId: application.collegeId },
            orderBy: { createdAt: "asc" }
        }),
        prisma.admissionDocument.findMany({
            where: {
                studentId: application.studentId,
                OR: [
                    { requirement: { collegeId: application.collegeId } },
                    { requirementId: null }
                ]
            },
            include: { requirement: { select: { id: true, name: true } } },
            orderBy: { createdAt: "desc" }
        })
    ]);

    return NextResponse.json({ application, requirements, documents });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "EMPLOYER" && role !== "COLLEGE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, step, remarks } = body;

    if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const statusToStep: Record<string, number> = {
        Pending: 1,
        "Profile Review": 1,
        "Documents Verification": 2,
        "Application Submitted": 3,
        "College Review": 4,
        "In Review": 4,
        Shortlisted: 4,
        Approved: 5,
        Rejected: 5,
        Offer: 5,
        Waitlist: 5
    };

    const resolvedStep = step ? Number(step) : statusToStep[status] || undefined;

    const updated = await prisma.admissionApplication.update({
        where: { id },
        data: { status, step: resolvedStep, remarks }
    });

    return NextResponse.json(updated);
}
