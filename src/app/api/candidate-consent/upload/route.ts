import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;
        const docType = (data.get('docType') as string) || 'document';

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        // Limit file size to 15MB
        if (file.size > 15 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'File size exceeds the 15MB limit' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Target upload directory in public/uploads
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Sanitize original file name
        const cleanName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_+/g, '_');
        const fileName = `${Date.now()}-${docType}-${cleanName}`;
        const filePath = path.join(uploadsDir, fileName);

        // Write file to disk
        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;

        console.log(`✅ Consent document uploaded successfully: ${fileName} (${(file.size / 1024).toFixed(1)} KB)`);

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName: file.name,
            size: file.size,
            docType
        });
    } catch (error) {
        console.error('❌ Consent document upload failed:', error);
        return NextResponse.json(
            { success: false, error: 'Upload failed. Please try again.' },
            { status: 500 }
        );
    }
}
