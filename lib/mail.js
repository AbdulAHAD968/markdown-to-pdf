import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Super PDF World - Password Recovery 🏰",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 4px solid #000; background: #fff;">
                <h1 style="color: #E52521; text-align: center; text-transform: uppercase;">Lost your Key?</h1>
                <p>Hello Hero,</p>
                <p>We received a request to reset your password for Super PDF World.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: #049CD8; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 4px solid #000; display: inline-block;">
                        RECOVER PASSWORD
                    </a>
                </div>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                    This link will expire in 1 hour.
                </p>
                <p style="text-align: center; font-size: 10px; color: #888;">© 2026 SUPER PDF WORLD</p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};
