"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = "YES", cancelText = "NO" }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="nes-container is-rounded with-title" style={{
        background: '#fff',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <p className="title">{title.toUpperCase()}</p>
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={32} color="var(--mario-red)" />
          <p style={{ fontSize: '12px' }}>{message}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="nes-btn is-error" onClick={onConfirm} style={{ fontSize: '10px' }}>
            {confirmText}
          </button>
          <button className="nes-btn" onClick={onCancel} style={{ fontSize: '10px' }}>
            {cancelText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
