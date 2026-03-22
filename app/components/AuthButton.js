"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{session.user.name.toUpperCase()}</span>
        <button 
          onClick={() => signOut()} 
          className="nes-btn is-error" 
          style={{ padding: '4px 8px', fontSize: '8px' }}
        >
          LOGOUT
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn()} 
      className="nes-btn is-primary" 
      style={{ padding: '4px 8px', fontSize: '8px' }}
    >
      PASSPORT LOGIN
    </button>
  );
}
