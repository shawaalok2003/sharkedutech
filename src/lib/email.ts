import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || 'Sharkedutech <noreply@sharkedutech.com>';

let transporter: nodemailer.Transporter | null = null;

if (emailUser && emailPassword) {
    transporter = nodemailer.createTransport({
        service: 'gmail', // or 'smtp.gmail.com'
        auth: {
            user: emailUser,
            pass: emailPassword,
        },
    });
}

export async function sendEmailOTP(email: string, code: string): Promise<boolean> {
    if (!transporter) {
        console.error('❌ Email not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env');
        return false;
    }

    try {
        await transporter.sendMail({
            from: emailFrom,
            to: email,
            subject: 'Your Sharkedutech Verification Code',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Sharkedutech</h1>
                            <p>Verification Code</p>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Your verification code is:</p>
                            <div class="otp-box">
                                <div class="otp-code">${code}</div>
                            </div>
                            <p><strong>This code will expire in 5 minutes.</strong></p>
                            <p>If you didn't request this code, please ignore this email.</p>
                            <div class="footer">
                                <p>© 2026 Sharkedutech. All rights reserved.</p>
                                <p>This is an automated email, please do not reply.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Your Sharkedutech verification code is: ${code}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        });
        console.log(`✅ Email OTP sent to ${email}`);
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
