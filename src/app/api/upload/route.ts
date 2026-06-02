import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        // Limit file size to 4MB for Base64 database storage
        if (file.size > 4 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: "File size exceeds the 4MB database limit" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert the file to a standard Base64 Data URL
        const base64String = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64String}`;

        console.log(`✅ File successfully converted to Base64 Data URL (Size: ${file.size} bytes)`);

        return NextResponse.json({
            success: true,
            url: dataUrl
        });

    } catch (error) {
        console.error("❌ Upload failed:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}
