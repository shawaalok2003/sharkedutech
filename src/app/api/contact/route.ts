import { NextResponse } from 'next/server';
import { sendContactEmail, validateEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        if (!validateEmail(email)) {
            return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
        }

        const sent = await sendContactEmail(name, email, message);

        if (!sent) {
            return NextResponse.json({ success: false, error: "Failed to send email. Please check server logs." }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Contact submission endpoint error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
