import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.admissionDocument.findMany({
        where: { studentId: ((session as any).user as any).id },
        include: { requirement: { select: { id: true, name: true, collegeId: true } } },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(documents);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, size, url, status, requirementId } = body;

    if (!name || !type || !url) {
        return NextResponse.json({ error: "name, type and url are required" }, { status: 400 });
    }

    const document = await prisma.admissionDocument.create({
        data: {
            studentId: ((session as any).user as any).id,
            name,
            type,
            size,
            url,
            status: status || "Pending",
            requirementId: requirementId || null
        }
    });

    return NextResponse.json(document);
}
