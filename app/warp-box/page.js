"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Upload, Trash2, File, Copy, Check, Download, AlertCircle } from "lucide-react";
import Link from "next/link";
import Notification from "@/app/components/Notification";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function WarpBox() {
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [visibility, setVisibility] = useState("public");

  
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState({ show: false, id: null });

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      showNotification("FAILED TO FETCH FILES", "error");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [session]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("visibility", session ? visibility : "public");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchFiles();
        showNotification(session ? "FILE WARPED TO CLOUD!" : "GUEST WARP COMPLETE!", "success");
      } else {
        showNotification("UPLOAD FAILED", "error");
      }
    } catch (err) {
      showNotification("SERVER ERROR DURING UPLOAD", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (id) => {
    setModal({ show: true, id });
  };

  const handleDelete = async () => {
    const id = modal.id;
    setModal({ show: false, id: null });
    
    try {
      const res = await fetch(`/api/upload/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFiles(f => f.filter(file => file._id !== id));
        showNotification("ITEM DISCARDED", "success");
      } else {
        showNotification("COULD NOT DELETE ITEM", "error");
      }
    } catch (err) {
      showNotification("NETWORK ERROR", "error");
    }
  };

  const copyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showNotification("LINK COPIED TO CLIPBOARD!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#5c94fc' }}>
      
      <div style={{
        padding: '15px 24px',
        background: '#fff',
        borderBottom: '4px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
        zIndex: 5
      }}>
        <Link href="/" className="nes-btn is-primary" style={{ padding: '4px 10px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={14} /> MAP
        </Link>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>WORLD 4-1</div>
          <div style={{ fontSize: '10px', color: '#666' }}>WARP BOX CLOUD</div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {session && (
            <div className="nes-select is-success" style={{ width: '140px' }}>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ padding: '4px', fontSize: '10px' }}>
                <option value="public">🌍 PUBLIC</option>
                <option value="private">🔒 PRIVATE</option>
              </select>
            </div>
          )}
          <label className={`nes-btn ${isUploading ? 'is-disabled' : 'is-success'}`} style={{ padding: '8px 16px', fontSize: '10px', margin: 0, cursor: 'pointer' }}>
            {isUploading ? "WARPING..." : "UPLOAD"}
            <input type="file" style={{ display: 'none' }} onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <main style={{ flex: 1, padding: '30px', overflowY: 'auto', position: 'relative' }}>
        
        {!session && (
          <div className="nes-container is-rounded is-dark" style={{ marginBottom: '30px', textAlign: 'center', padding: '10px' }}>
            <p style={{ fontSize: '10px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <AlertCircle size={16} color="var(--mario-yellow)" />
              GUEST MODE: UPLOADS ARE PUBLIC. LOGIN TO SECURE YOUR FILES!
            </p>
          </div>
        )}

        
        <div className="nes-container is-rounded" style={{ background: '#fff', padding: '20px' }}>
          <div className="pane-header" style={{ marginBottom: '20px', background: '#212529', color: '#fff', padding: '8px', fontSize: '12px' }}>
            INVENTORY ({files.length} ITEMS)
          </div>

          <div className="nes-table-responsive" style={{ border: 'none' }}>
            <table className="nes-table is-bordered is-centered" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ fontSize: '10px', border: 'none' }}>ITEM</th>
                  <th style={{ fontSize: '10px', border: 'none' }}>TYPE</th>
                  <th style={{ fontSize: '10px', border: 'none' }}>STATUS</th>
                  <th style={{ fontSize: '10px', border: 'none' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <p style={{ fontSize: '12px' }}>NO ITEMS IN WARP BOX</p>
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file._id} style={{ transition: 'transform 0.2s' }}>
                      <td style={{ fontSize: '10px', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <File size={14} color="#5c94fc" />
                          {file.fileName}
                        </div>
                      </td>
                      <td style={{ fontSize: '10px' }}>
                        <span className="nes-text is-disabled">{file.fileType?.split('/')[1]?.toUpperCase() || 'BIN'}</span>
                      </td>
                      <td>
                        <span className={`nes-badge`} style={{ transform: 'scale(0.6)' }}>
                          <span className={file.visibility === 'public' ? 'is-success' : 'is-dark'}>
                            {file.visibility.toUpperCase()}
                          </span>
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <a 
                          href={file.fileUrl.replace('/upload/', '/upload/fl_attachment/')} 
                          download={file.fileName}
                          className="nes-btn is-warning" 
                          style={{ padding: '4px 8px', display: 'flex', alignItems: 'center' }}
                          title="DOWNLOAD"
                        >
                          <Download size={12} />
                        </a>
                        <button 
                          className="nes-btn is-primary" 
                          style={{ padding: '4px 8px' }}
                          onClick={() => copyLink(file.fileUrl, file._id)}
                          title="COPY LINK"
                        >
                          {copiedId === file._id ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <button 
                          className="nes-btn is-error" 
                          style={{ padding: '4px 8px' }}
                          onClick={() => confirmDelete(file._id)}
                          title="DELETE"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {modal.show && (
        <ConfirmModal 
          title="DISCARD ITEM?"
          message="ARE YOU SURE YOU WANT TO DELETE THIS FILE FROM THE CLOUD?"
          onConfirm={handleDelete}
          onCancel={() => setModal({ show: false, id: null })}
        />
      )}

      
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', fontSize: '3rem', opacity: 0.2, zIndex: 0 }}>🍄</div>
      <div style={{ position: 'fixed', bottom: '40px', left: '40px', fontSize: '2rem', opacity: 0.1, zIndex: 0 }}>⭐</div>
    </div>
  );
}
