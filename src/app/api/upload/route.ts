import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client dynamically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // --- PRODUCTION: SUPABASE STORAGE ---
        if (supabase) {
            try {
                const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
                const bucketName = 'uploads';

                // Check and ensure the 'uploads' bucket exists
                const { data: buckets } = await supabase.storage.listBuckets();
                const bucketExists = buckets?.some(b => b.name === bucketName);
                if (!bucketExists) {
                    await supabase.storage.createBucket(bucketName, {
                        public: true,
                        fileSizeLimit: 10485760 // 10MB
                    });
                }

                // Upload file to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filename, buffer, {
                        contentType: file.type,
                        upsert: true
                    });

                if (uploadError) {
                    throw uploadError;
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filename);

                console.log(`✅ Uploaded file to Supabase Storage: ${publicUrl}`);

                return NextResponse.json({
                    success: true,
                    url: publicUrl
                });

            } catch (supabaseError) {
                console.error("⚠️ Supabase upload failed, falling back to local storage:", supabaseError);
                // Fall through to local storage fallback
            }
        }

        // --- LOCAL DEVELOPMENT FALLBACK: WRITE TO DISK ---
        console.log("💾 Using local filesystem storage fallback...");
        const uploadDir = join(process.cwd(), 'public/uploads');
        await mkdir(uploadDir, { recursive: true });

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const filePath = join(uploadDir, filename);

        await writeFile(filePath, buffer);
        console.log(`✅ Saved file locally to ${filePath}`);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error("❌ Upload failed entirely:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}
