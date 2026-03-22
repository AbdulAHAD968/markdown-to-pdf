"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Notification from "@/app/components/Notification";
import "../auth-forms.css";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                setNotification({ message: "REGISTRATION SUCCESSFUL! REDIRECTING...", type: "success" });
                setTimeout(() => router.push("/auth/signin"), 2000);
            } else {
                const data = await res.json();
                setNotification({ message: data.error || "REGISTRATION FAILED", type: "error" });
            }
        } catch (error) {
            setNotification({ message: "CONNECTION ERROR", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <div className="auth-form-card">
                    <div className="auth-form-header">
                        <h2 className="auth-form-title">⭐ SIGN UP</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label>NAME</label>
                            <input
                                type="text"
                                placeholder="Mario"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                            className={`auth-submit-btn success ${isLoading ? 'disabled' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "LOADING..." : "REGISTER"}
                        </button>
                    </form>

                    <div className="auth-links">
                        <Link href="/auth/signin" className="auth-link danger">
                            ALREADY HAVE AN ACCOUNT? LOGIN
                        </Link>
                    </div>
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

