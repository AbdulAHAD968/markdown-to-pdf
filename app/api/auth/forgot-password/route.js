import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendResetPasswordEmail } from "@/lib/mail";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });

        // For security, don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send Email
        try {
            await sendResetPasswordEmail(user.email, resetToken);
        } catch (mailError) {
            console.error("Failed to send email:", mailError);
            return NextResponse.json({ error: "FAILED TO SEND RECOVERY EMAIL" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
