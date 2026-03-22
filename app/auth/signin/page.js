"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Notification from "@/app/components/Notification";
import "../auth-forms.css";

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (res?.error) {
                setNotification({ message: "INVALID EMAIL OR PASSWORD", type: "error" });
            } else {
                router.push(callbackUrl);
            }
        } catch (error) {
            setNotification({ message: "CONNECTION ERROR", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-card">
                <div className="auth-form-header">
                    <h2 className="auth-form-title">🍄 SIGN IN</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>EMAIL</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`auth-submit-btn primary ${isLoading ? 'disabled' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "LOADING..." : "LOGIN"}
                    </button>
                </form>

                <div className="auth-links">
                    <Link href="/auth/signup" className="auth-link primary">
                        NEW USER? REGISTER HERE
                    </Link>
                    <Link href="/auth/forgot-password" className="auth-link secondary">
                        FORGOT PASSWORD?
                    </Link>
                </div>
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

export default function SignInPage() {
    return (
        <div className="auth-page">
            <Suspense fallback={<div className="auth-loading">LOADING...</div>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}

