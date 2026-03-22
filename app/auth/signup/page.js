"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Notification from "@/app/components/Notification";

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
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--sky-blue)',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <div className="nes-container is-rounded" style={{ background: '#fff', padding: '20px' }}>
                    <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '30px' }}>SIGN UP</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="nes-field">
                            <label style={{ fontSize: '12px' }}>NAME</label>
                            <input
                                type="text"
                                className="nes-input"
                                placeholder="Mario"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="nes-field">
                            <label style={{ fontSize: '12px' }}>EMAIL</label>
                            <input
                                type="email"
                                className="nes-input"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="nes-field">
                            <label style={{ fontSize: '12px' }}>PASSWORD</label>
                            <input
                                type="password"
                                className="nes-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`nes-btn ${isLoading ? 'is-disabled' : 'is-success'}`}
                            disabled={isLoading}
                            style={{ marginTop: '10px', fontSize: '12px' }}
                        >
                            {isLoading ? "LOADING..." : "REGISTER"}
                        </button>
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Link href="/auth/signin" style={{ fontSize: '10px', color: '#E52521', textDecoration: 'none' }}>
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

