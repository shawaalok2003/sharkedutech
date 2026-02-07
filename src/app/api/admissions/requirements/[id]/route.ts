import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "EMPLOYER" && role !== "COLLEGE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const existing = await prisma.admissionRequirement.findUnique({
        where: { id },
        include: { college: { select: { adminId: true } } }
    });

    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (role !== "ADMIN" && existing.college?.adminId !== ((session as any).user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.admissionRequirement.update({
        where: { id },
        data: {
            name: body.name ?? undefined,
            description: body.description ?? undefined,
            required: body.required ?? undefined
        }
    });

    return NextResponse.json(updated);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "EMPLOYER" && role !== "COLLEGE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const existing = await prisma.admissionRequirement.findUnique({
        where: { id },
        include: { college: { select: { adminId: true } } }
    });

    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (role !== "ADMIN" && existing.college?.adminId !== ((session as any).user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.admissionRequirement.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
