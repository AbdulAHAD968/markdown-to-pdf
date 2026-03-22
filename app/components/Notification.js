"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

export default function Notification({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: { color: "#92cc41", icon: <CheckCircle size={14} /> },
    error: { color: "#e76e55", icon: <AlertTriangle size={14} /> },
    warning: { color: "#f7d51d", icon: <AlertTriangle size={14} /> }
  };

  const { color, icon } = typeConfig[type] || typeConfig.success;

  return (
    <div className="nes-container is-rounded" style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      background: '#fff',
      padding: '10px 15px',
      boxShadow: `4px 4px 0 rgba(0,0,0,0.2)`,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '250px',
      border: `4px solid ${color}`,
      animation: 'slideIn 0.3s ease'
    }}>
      <div style={{ color }}>{icon}</div>
      <div style={{ fontSize: '10px', flex: 1, fontWeight: 'bold' }}>{message.toUpperCase()}</div>
      <button onClick={onClose} style={{
        background: 'none',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        color: '#666'
      }}>
        <X size={14} />
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
