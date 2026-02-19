import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let collegeId = searchParams.get("collegeId") || undefined;
    const role = (session.user as any).role;
    if (!collegeId && (role === "EMPLOYER" || role === "COLLEGE")) {
        const college = await prisma.college.findFirst({
            where: { adminId: ((session as any).user as any).id },
            select: { id: true }
        });

        if (!college) {
            return NextResponse.json({
                totalApplications: 0,
                pending: 0,
                shortlisted: 0,
                accepted: 0
            });
        }
        collegeId = college.id;
    }

    const totalApplications = await prisma.admissionApplication.count({
        where: collegeId ? { collegeId } : undefined
    });
    const pending = await prisma.admissionApplication.count({
        where: {
            ...(collegeId ? { collegeId } : {}),
            status: "Pending"
        }
    });
    const shortlisted = await prisma.admissionApplication.count({
        where: {
            ...(collegeId ? { collegeId } : {}),
            status: "Shortlisted"
        }
    });
    const accepted = await prisma.admissionApplication.count({
        where: {
            ...(collegeId ? { collegeId } : {}),
            status: "Accepted"
        }
    });

    return NextResponse.json({
        totalApplications,
        pending,
        shortlisted,
        accepted
    });
}
