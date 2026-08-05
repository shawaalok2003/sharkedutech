import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

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
    const existing = await prisma.collegePhoto.findUnique({
        where: { id },
        include: { college: { select: { adminId: true } } }
    });

    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (role !== "ADMIN" && existing.college?.adminId !== ((session as any).user as any).id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.collegePhoto.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
