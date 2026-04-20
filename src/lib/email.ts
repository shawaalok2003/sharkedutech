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

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
