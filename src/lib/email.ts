import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || 'Sharkedutech <noreply@sharkedutech.com>';

let transporter: nodemailer.Transporter | null = null;

if (emailUser && emailPassword) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword.replace(/\s/g, ''),
        },
    });
}

export async function sendEmailOTP(email: string, code: string): Promise<boolean> {
    if (!transporter) {
        console.error('❌ Email not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env');
        return false;
    }

    try {
        const result = await transporter.sendMail({
            from: emailFrom,
            to: email,
            subject: 'Your Sharkedutech Verification Code',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
                        .wrapper { background-color: #f8fafc; padding: 40px 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                        .header { background: #0f172a; padding: 40px; text-align: center; }
                        .logo-text { color: #fbbf24; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
                        .content { padding: 40px; }
                        .otp-box { background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; border: 1px dashed #cbd5e1; }
                        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #0f172a; }
                        .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; background: #f8fafc; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="container">
                            <div class="header">
                                <div class="logo-text">SHARKEDUTECH</div>
                            </div>
                            <div class="content">
                                <h2 style="margin-top: 0; color: #0f172a;">Verify your email</h2>
                                <p>Hi there,</p>
                                <p>Thank you for choosing Sharkedutech. Use the following code to complete your verification process:</p>
                                <div class="otp-box">
                                    <div class="otp-code">${code}</div>
                                </div>
                                <p style="font-weight: 600; color: #ef4444;">This code is valid for 5 minutes.</p>
                                <p>If you didn't request this, please ignore this email or contact support.</p>
                            </div>
                            <div class="footer">
                                <p>© 2026 Sharkedutech. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Your Sharkedutech verification code is: ${code}`,
        });
        console.log(`✅ Email OTP sent to ${email} (MessageID: ${result.messageId})`);
        return true;
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return false;
    }
}

export async function sendJobApplicationEmail(email: string, name: string, jobTitle: string, companyName: string): Promise<boolean> {
    if (!transporter) return false;

    try {
        await transporter.sendMail({
            from: emailFrom,
            to: email,
            subject: `Application Received: ${jobTitle} at ${companyName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #fbbf24; font-weight: 800; font-size: 20px;">SHARKEDUTECH</div>
                    <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
                        <h2 style="margin-top: 0;">Application Confirmation</h2>
                        <p>Hi ${name},</p>
                        <p>We've received your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                        <p>The employer has been notified and will review your profile shortly. You can track your application status in your dashboard.</p>
                        <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                            <p style="margin: 0; font-weight: 600;">What's next?</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px;">If the employer is interested, they will contact you directly through the platform or via email.</p>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8fafc; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
                        © 2026 Sharkedutech. Connecting Talent with Opportunity.
                    </div>
                </div>
            `
        });
        return true;
    } catch (e) {
        console.error("Job email error:", e);
        return false;
    }
}

export async function sendAdmissionApplicationEmail(email: string, name: string, collegeName: string, courseName: string): Promise<boolean> {
    if (!transporter) return false;

    try {
        await transporter.sendMail({
            from: emailFrom,
            to: email,
            subject: `Admission Application Submitted: ${collegeName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #fbbf24; font-weight: 800; font-size: 20px;">SHARKEDUTECH</div>
                    <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
                        <h2 style="margin-top: 0;">Admission Application Received</h2>
                        <p>Hi ${name},</p>
                        <p>Congratulations! Your admission application for <strong>${courseName}</strong> at <strong>${collegeName}</strong> has been successfully submitted.</p>
                        <p>The college administration team will review your documents and academic profile. You can check for updates or requested documents in your student portal.</p>
                        <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
                            <p style="margin: 0; font-weight: 600; color: #166534;">Important Note:</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #166534;">Please ensure all your academic documents are uploaded correctly to avoid delays in processing.</p>
                        </div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8fafc; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
                        © 2026 Sharkedutech. Empowering Hospitality Careers.
                    </div>
                </div>
            `
        });
        return true;
    } catch (e) {
        console.error("Admission email error:", e);
        return false;
    }
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
