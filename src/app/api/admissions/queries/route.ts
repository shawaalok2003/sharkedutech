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
        const queries = await prisma.admissionQuery.findMany({
            where: collegeId ? { collegeId } : undefined,
            include: {
                student: { select: { name: true, email: true } },
                college: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(queries);
    }

    const queries = await prisma.admissionQuery.findMany({
        where: { studentId: ((session as any).user as any).id },
        include: { college: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(queries);
}


export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { collegeId, subject, message } = body;

    if (!collegeId || !subject || !message) {
        return NextResponse.json({ error: "collegeId, subject, and message are required" }, { status: 400 });
    }

    const query = await prisma.admissionQuery.create({
        data: {
            studentId: ((session as any).user as any).id,
            collegeId,
            subject,
            message
        }
    });

    return NextResponse.json(query);
}
