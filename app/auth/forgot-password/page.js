"use client";

import { useState } from "react";
import Link from "next/link";
import Notification from "@/app/components/Notification";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setNotification({ 
                message: "IF AN ACCOUNT EXISTS, A RECOVERY LINK HAS BEEN SENT.", 
                type: "success" 
            });
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
                    <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '30px' }}>LOST KEY?</h2>
                    
                    <p style={{ fontSize: '10px', color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
                        ENTER YOUR EMAIL TO RECEIVE A RECOVERY LINK.
                    </p>

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

                        <button
                            type="submit"
                            className={`nes-btn ${isLoading ? 'is-disabled' : 'is-primary'}`}
                            disabled={isLoading}
                            style={{ marginTop: '10px', fontSize: '12px' }}
                        >
                            {isLoading ? "SENDING..." : "RECOVER"}
                        </button>
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Link href="/auth/signin" style={{ fontSize: '10px', color: '#049CD8', textDecoration: 'none' }}>
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
