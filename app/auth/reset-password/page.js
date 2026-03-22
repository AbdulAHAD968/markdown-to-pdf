"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Notification from "@/app/components/Notification";

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
            <div className="nes-container is-rounded" style={{ background: '#fff', padding: '20px', textAlign: 'center' }}>
                <p className="nes-text is-error">INVALID OR EXPIRED TOKEN</p>
                <Link href="/auth/signin" className="nes-btn is-primary" style={{ marginTop: '20px' }}>BACK TO LOGIN</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
            <div className="nes-container is-rounded" style={{ background: '#fff', padding: '20px' }}>
                <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '30px' }}>RESET PASSWORD</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="nes-field">
                        <label style={{ fontSize: '12px' }}>NEW PASSWORD</label>
                        <input
                            type="password"
                            className="nes-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="nes-field">
                        <label style={{ fontSize: '12px' }}>CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            className="nes-input"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`nes-btn ${isLoading ? 'is-disabled' : 'is-primary'}`}
                        disabled={isLoading}
                        style={{ marginTop: '10px', fontSize: '12px' }}
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
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--sky-blue)',
            padding: '20px'
        }}>
            <Suspense fallback={<div>LOADING...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
