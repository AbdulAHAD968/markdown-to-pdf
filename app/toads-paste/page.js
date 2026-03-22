"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, Trash2, Copy, Check, ExternalLink, FileText, Globe, Lock } from "lucide-react";
import Link from "next/link";
import Notification from "@/app/components/Notification";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function ToadsPaste() {
  const { data: session } = useSession();
  const [snippets, setSnippets] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [visibility, setVisibility] = useState("public");

  // Custom UI States
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState({ show: false, id: null });

  const fetchSnippets = async () => {
    try {
      const res = await fetch("/api/paste");
      const data = await res.json();
      setSnippets(data);
    } catch (err) {
      showNotification("FAILED TO LOAD PASTES", "error");
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [session]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          visibility: session ? visibility : "public",
        }),
      });
      if (res.ok) {
        fetchSnippets();
        setContent("");
        setTitle("");
        showNotification(session ? "PASTE SAVED TO INVENTORY!" : "GUEST PASTE SAVED!", "success");
      } else {
        showNotification("FAILED TO SAVE PASTE", "error");
      }
    } catch (err) {
      showNotification("SERVER ERROR", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDiscard = (id) => {
    setModal({ show: true, id });
  };

  const handleDiscard = async () => {
    const id = modal.id;
    setModal({ show: false, id: null });
    
    try {
      const res = await fetch(`/api/paste/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSnippets(s => s.filter(snippet => snippet._id !== id));
        showNotification("PASTE DISCARDED", "success");
      } else {
        showNotification("COULD NOT DISCARD PASTE", "error");
      }
    } catch (err) {
      showNotification("NETWORK ERROR", "error");
    }
  };

  const copyLink = (id) => {
    const url = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showNotification("LINK COPIED!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#ffccbb' }}>
      {/* Header Bar */}
      <div style={{
        padding: '15px 24px',
        background: '#fff',
        borderBottom: '4px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
        zIndex: 5
      }}>
        <Link href="/" className="nes-btn is-primary" style={{ padding: '4px 10px', fontSize: '10px' }}>
          <ArrowLeft size={14} /> MAP
        </Link>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>WORLD 4-2</div>
          <div style={{ fontSize: '10px', color: '#666' }}>TOAD'S PASTE BIN</div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {session && (
            <div className="nes-select is-warning" style={{ width: '140px' }}>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ padding: '4px', fontSize: '10px' }}>
                <option value="public">🌍 PUBLIC</option>
                <option value="private">🔒 PRIVATE</option>
              </select>
            </div>
          )}
          <button 
            className={`nes-btn ${isSaving || !content ? 'is-disabled' : 'is-success'}`} 
            onClick={handleSave} 
            disabled={isSaving || !content}
            style={{ padding: '8px 16px', fontSize: '10px' }}
          >
            {isSaving ? "SAVING..." : "SAVE PASTE"}
          </button>
        </div>
      </div>

      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '20px', gap: '20px' }}>
        {/* Editor Side */}
        <section style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="nes-container is-rounded with-title" style={{ background: '#fff', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p className="title">NEW SNIPPET</p>
            <input 
              type="text" 
              placeholder="GIVE IT A TITLE..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="nes-input"
              style={{ marginBottom: '15px', fontSize: '12px' }}
            />
            <textarea
              className="nes-textarea"
              placeholder="PASTE YOUR MAGIC HERE..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ flex: 1, marginBottom: '0', fontSize: '12px', fontFamily: '"Courier New", Courier, monospace' }}
            />
          </div>
        </section>

        {/* List Side */}
        <section style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
          <div className="nes-container is-rounded with-title" style={{ background: '#fff', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '10px' }}>
            <p className="title">PASTES</p>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
              {snippets.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', opacity: 0.5 }}>
                  <p style={{ fontSize: '10px' }}>LOG IS EMPTY</p>
                </div>
              ) : (
                snippets.map((s) => (
                  <div key={s._id} className="nes-container is-rounded" style={{ 
                    padding: '8px', 
                    marginBottom: '10px', 
                    background: '#f8f9fa', 
                    fontSize: '10px',
                    border: '2px solid #000'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                        {s.title || "UNTITLED"}
                      </div>
                      {s.visibility === 'public' ? <Globe size={12} color="#92cc41" /> : <Lock size={12} color="#666" />}
                    </div>
                    
                    <div style={{ fontSize: '8px', color: '#777', marginBottom: '12px' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/p/${s._id}`} target="_blank" className="nes-btn is-primary" style={{ padding: '2px 8px', flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <ExternalLink size={12} />
                      </Link>
                      <button className="nes-btn is-warning" style={{ padding: '2px 8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => copyLink(s._id)}>
                        {copiedId === s._id ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                      <button className="nes-btn is-error" style={{ padding: '2px 8px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => confirmDiscard(s._id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Popups */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {modal.show && (
        <ConfirmModal 
          title="DISCARD PASTE?"
          message="ARE YOU SURE YOU WANT TO DISCARD THIS SNIPPET FOREVER?"
          onConfirm={handleDiscard}
          onCancel={() => setModal({ show: false, id: null })}
        />
      )}
    </div>
  );
}

