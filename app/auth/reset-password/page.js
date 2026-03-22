"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Notification from "@/app/components/Notification";
import "../auth-forms.css";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setNotification({ message: "PASSWORDS DO NOT MATCH", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                setNotification({ message: "PASSWORD RESET SUCCESSFUL! REDIRECTING...", type: "success" });
                setTimeout(() => router.push("/auth/signin"), 2000);
            } else {
                const data = await res.json();
                setNotification({ message: data.error || "RESET FAILED", type: "error" });
            }
        } catch (error) {
            setNotification({ message: "CONNECTION ERROR", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-form-card">
                <div className="auth-error-container">
                    <p className="auth-error-message">⚠️ INVALID OR EXPIRED TOKEN</p>
                    <Link href="/auth/signin" className="auth-submit-btn primary auth-error-link">
                        BACK TO LOGIN
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-form-container">
            <div className="auth-form-card">
                <div className="auth-form-header">
                    <h2 className="auth-form-title">🔐 RESET PASSWORD</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>NEW PASSWORD</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`auth-submit-btn primary ${isLoading ? 'disabled' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                    </button>
                </form>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="auth-page">
            <Suspense fallback={<div className="auth-loading">LOADING...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
