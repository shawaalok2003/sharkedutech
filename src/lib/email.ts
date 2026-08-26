import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

function loadEnvVars() {
    if (!process.env.EMAIL_USER && !process.env.SMTP_USER) {
        try {
            const possiblePaths = [
                path.join(process.cwd(), '.env'),
                path.join(process.cwd(), '.env.production'),
                path.join(process.cwd(), '..', '.env'),
                path.join(process.cwd(), '..', '.env.production'),
            ];
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    const content = fs.readFileSync(p, 'utf8');
                    content.split('\n').forEach(line => {
                        const m = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"\r\n]+)"?\s*$/);
                        if (m && !process.env[m[1]]) {
                            process.env[m[1]] = m[2];
                        }
                    });
                }
            }
        } catch (_) {}
    }
}

function getTransporter(): nodemailer.Transporter {
    loadEnvVars();

    const user = process.env.EMAIL_USER || process.env.SMTP_USER || 'sharkedutechinternational@gmail.com';
    const pass = (process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || 'eszv vwry rhlo hxvn').replace(/\s/g, '');
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 465;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });
}

function getFromAddress(): string {
    loadEnvVars();
    const user = process.env.EMAIL_USER || process.env.SMTP_USER || 'sharkedutechinternational@gmail.com';
    return `Sharkedutech <${user}>`;
}

export async function sendEmailOTP(email: string, code: string): Promise<boolean> {
    try {
        const transporter = getTransporter();
        const result = await transporter.sendMail({
            from: getFromAddress(),
            to: email,
            replyTo: getFromAddress(),
            subject: 'Your Sharkedutech Verification Code',
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            },
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
    try {
        const transporter = getTransporter();
        await transporter.sendMail({
            from: getFromAddress(),
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
    try {
        const transporter = getTransporter();
        await transporter.sendMail({
            from: getFromAddress(),
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

export async function sendAdmissionStatusEmail(email: string, name: string, collegeName: string, courseName: string, status: string, remarks?: string): Promise<boolean> {
    let statusHtml = '';
    let subject = `Admission Application Status Update: ${status} at ${collegeName}`;

    if (status === 'Approved' || status === 'Offer') {
        statusHtml = `
            <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
                <p style="margin: 0; font-weight: 600; color: #166534; font-size: 18px;">Congratulations! Admission Approved! 🎉</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #14532d;">The college has officially issued an offer for you. Please check your student portal dashboard for further steps regarding confirmation and document submissions.</p>
            </div>
        `;
    } else if (status === 'Rejected') {
        statusHtml = `
            <div style="margin-top: 30px; padding: 20px; background: #fef2f2; border-radius: 8px; border: 1px solid #fca5a5;">
                <p style="margin: 0; font-weight: 600; color: #991b1b; font-size: 16px;">Application Update</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #7f1d1d;">Unfortunately, your application for admission has not been accepted at this time.</p>
            </div>
        `;
    } else {
        statusHtml = `
            <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; font-weight: 600; color: #0f172a;">Status Update: ${status}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #475569;">Your application is currently marked as: <strong>${status}</strong>.</p>
            </div>
        `;
    }

    if (remarks) {
        statusHtml += `
            <div style="margin-top: 15px; padding: 15px; background: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1;">
                <p style="margin: 0 0 5px 0; font-weight: 600; font-size: 14px; color: #334155;">Remarks from Admission Office:</p>
                <p style="margin: 0; font-size: 14px; color: #475569; white-space: pre-wrap;">${remarks}</p>
            </div>
        `;
    }

    try {
        const transporter = getTransporter();
        await transporter.sendMail({
            from: getFromAddress(),
            to: email,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #fbbf24; font-weight: 800; font-size: 20px;">SHARKEDUTECH</div>
                    <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
                        <h2 style="margin-top: 0;">Application Status Update</h2>
                        <p>Hi ${name},</p>
                        <p>There is an update regarding your admission application for <strong>${courseName}</strong> at <strong>${collegeName}</strong>.</p>
                        ${statusHtml}
                        <p style="margin-top: 25px;">You can view the full details and track your application status anytime in your Student Portal.</p>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8fafc; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
                        © 2026 Sharkedutech. Empowering Hospitality Careers.
                    </div>
                </div>
            `
        });
        return true;
    } catch (e) {
        console.error("Admission status email error:", e);
        return false;
    }
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function sendContactEmail(name: string, email: string, message: string): Promise<boolean> {
    try {
        const transporter = getTransporter();
        const adminEmail = process.env.EMAIL_USER || process.env.SMTP_USER || 'sharkedutechinternational@gmail.com';
        await transporter.sendMail({
            from: getFromAddress(),
            to: adminEmail, // Admin's email address
            subject: `New Contact Form Inquiry from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #fbbf24; font-weight: 800; font-size: 20px;">SHARKEDUTECH</div>
                    <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
                        <h2 style="margin-top: 0; color: #0f172a;">New Contact Inquiry Received</h2>
                        <p>You have received a new message from the website contact form.</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Message:</strong></p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${message}</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8fafc; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
                        © 2026 Sharkedutech Administration
                    </div>
                </div>
            `
        });
        console.log(`✅ Contact inquiry email sent to admin (${adminEmail})`);
        return true;
    } catch (error) {
        console.error("❌ Failed to send contact email to admin:", error);
        return false;
    }
}

export async function sendAdminInviteEmail(
    email: string,
    permissions: string[],
    inviteToken: string,
    invitedByName: string = "Super Admin"
): Promise<boolean> {
    try {
        const transporter = getTransporter();
        const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sharkedutech.com';
        const verifyLink = `${baseUrl}/auth/verify-admin?token=${inviteToken}&email=${encodeURIComponent(email)}`;

        const permLabels: Record<string, string> = {
            manage_jobs: "Job Listings & Applications",
            manage_colleges: "Colleges Directory & Partner Inquiries",
            manage_admissions: "Admissions Courses & Student Applications",
            manage_users: "User Accounts & Role Management"
        };

        const permBadges = permissions.map(p => 
            `<span style="background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 13px; display: inline-block; margin: 3px 4px 3px 0; font-weight: 600;">
                ✓ ${permLabels[p] || p}
            </span>`
        ).join('');

        await transporter.sendMail({
            from: getFromAddress(),
            to: email,
            subject: `🔐 Official Admin Access Invitation — Shark Edutech`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #000c1e 0%, #001736 100%); padding: 35px 25px; text-align: center; color: #ffffff;">
                        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #ffffff;">SHARK EDUTECH</h1>
                        <p style="margin: 0; color: #fed488; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Role-Based Admin Access Verification
                        </p>
                    </div>
                    <div style="padding: 30px 25px; color: #1e293b; line-height: 1.6;">
                        <h2 style="margin-top: 0; color: #001736; font-size: 20px;">You Have Been Invited as an Administrator</h2>
                        <p>Hello,</p>
                        <p><strong>${invitedByName}</strong> has granted you administrative access to the <strong>Shark Edutech Platform</strong> with the following specific permissions:</p>
                        
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                            <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 14px; color: #001736;">Assigned Administrative Permissions:</p>
                            <div>${permBadges}</div>
                        </div>

                        <p>To verify your email address and activate your administrator account, please click the button below:</p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verifyLink}" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
                                Verify Email &amp; Activate Admin Access →
                            </a>
                        </div>

                        <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste this link into your browser:<br />
                            <a href="${verifyLink}" style="color: #2563eb; word-break: break-all;">${verifyLink}</a>
                        </p>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #f8fafc; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
                        © 2026 Shark International Edutech Pvt. Ltd. All rights reserved.
                    </div>
                </div>
            `
        });
        console.log(`✅ Admin invitation verification email sent to ${email}`);
        return true;
    } catch (e) {
        console.error("Admin invite email error:", e);
        return false;
    }
}
