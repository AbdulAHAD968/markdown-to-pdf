"use client";

import { useState } from "react";
import Link from "next/link";
import Notification from "@/app/components/Notification";
import "../auth-forms.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setNotification({
                    message: "IF AN ACCOUNT EXISTS, A RECOVERY LINK HAS BEEN SENT.",
                    type: "success"
                });
            } else {
                setNotification({ message: "COULD NOT PROCESS REQUEST", type: "error" });
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
                        <h2 className="auth-form-title">🔑 LOST KEY?</h2>
                        <p className="auth-form-description">
                            ENTER YOUR EMAIL TO RECEIVE A RECOVERY LINK.
                        </p>
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

                        <button
                            type="submit"
                            className={`auth-submit-btn primary ${isLoading ? 'disabled' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "SENDING..." : "RECOVER"}
                        </button>
                    </form>

                    <div className="auth-links">
                        <Link href="/auth/signin" className="auth-link primary">
                            BACK TO LOGIN
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
