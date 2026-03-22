"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function ViewSnippet() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await fetch(`/api/paste/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSnippet(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSnippet();
  }, [id]);

  const copyContent = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>WARPING SNIPPET...</div>;
  }

  if (!snippet) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>GAME OVER: SNIPPET NOT FOUND</p>
        <Link href="/" className="nes-btn is-primary">BACK TO WORLD MAP</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff9c4' }}>
      <header style={{ 
        padding: '10px 24px', 
        background: '#fbc02d', 
        borderBottom: '4px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>
          <ArrowLeft size={16} style={{ verticalAlign: 'middle' }} /> BACK TO MAP
        </Link>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{snippet.title.toUpperCase()}</div>
        <button className="nes-btn is-success" onClick={copyContent} style={{ padding: '4px 10px', fontSize: '10px' }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </header>
      
      <main style={{ flex: 1, padding: '20px' }}>
        <div className="nes-container is-rounded" style={{ background: '#fff', height: '100%', minHeight: '400px' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
            {snippet.content}
          </pre>
        </div>
      </main>
      
      <footer style={{ padding: '20px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
        WARPED ON {new Date(snippet.createdAt).toLocaleDateString()}
      </footer>
    </div>
  );
}
