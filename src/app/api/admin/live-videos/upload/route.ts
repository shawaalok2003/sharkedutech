import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions as any);
    const role = ((session as any)?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;
        const uploadType = (data.get('type') as string) || 'video'; // 'video' or 'thumbnail'

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        // Limit video file size to 150MB, thumbnail to 10MB
        const maxLimit = uploadType === 'video' ? 150 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxLimit) {
            const limitMb = maxLimit / (1024 * 1024);
            return NextResponse.json(
                { success: false, error: `File size exceeds the ${limitMb}MB limit` },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const subDir = uploadType === 'video' ? 'videos' : 'thumbnails';
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', subDir);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const cleanName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_+/g, '_');
        const fileName = `${Date.now()}-${cleanName}`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${subDir}/${fileName}`;

        console.log(`✅ Uploaded live ${uploadType}: ${fileName} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName: file.name,
            size: file.size,
            uploadType
        });
    } catch (error) {
        console.error('❌ Live video/thumbnail upload error:', error);
        return NextResponse.json(
            { success: false, error: 'File upload failed' },
            { status: 500 }
        );
    }
}
