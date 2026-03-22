"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Notification from "@/app/components/Notification";

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
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
            <div className="nes-container is-rounded" style={{ background: '#fff', padding: '20px' }}>
                <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '30px' }}>SIGN IN</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        className={`nes-btn ${isLoading ? 'is-disabled' : 'is-primary'}`}
                        disabled={isLoading}
                        style={{ marginTop: '10px', fontSize: '12px' }}
                    >
                        {isLoading ? "LOADING..." : "LOGIN"}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link href="/auth/signup" style={{ fontSize: '10px', color: '#049CD8', textDecoration: 'none' }}>
                        NEW USER? REGISTER HERE
                    </Link>
                    <Link href="/auth/forgot-password" style={{ fontSize: '10px', color: '#666', textDecoration: 'none' }}>
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
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'var(--sky-blue)',
            padding: '20px'
        }}>
            <Suspense fallback={<div>LOADING...</div>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}

