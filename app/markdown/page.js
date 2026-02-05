"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Download, ArrowLeft } from "lucide-react"; 
import Link from "next/link";
import "github-markdown-css/github-markdown-light.css";

export default function MarkdownWorld() {
  const [markdown, setMarkdown] = useState("# Welcome to World 1-1\n\nIt's a me, Markdown!\n\n- [ ] Collect Coins\n- [ ] Save Princess");
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (event) => setMarkdown(event.target.result);
      reader.readAsText(file);
    } else {
      alert("Only .md files allowed in World 1-1!");
    }
  }, []);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: markdown, type: 'markdown' }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mario-markdown.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Game Over: PDF Generation Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay" style={{ background: 'rgba(229, 37, 33, 0.8)', color: '#fff' }}>
          DROP FILE TO WARP
        </div>
      )}

      
      <div style={{
        padding: '10px 24px',
        background: 'rgba(0,0,0,0.1)',
        borderBottom: '4px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <ArrowLeft size={16} /> BACK TO MAP
        </Link>
        <button className="nes-btn is-primary" onClick={() => setMarkdown("")} style={{ padding: '0.5rem 1rem', fontSize: '10px' }}>RESET</button>
      </div>

      <main className="main-content">
        <section className="editor-pane">
          <div className="pane-header">MD EDITOR ZONE</div>
          <textarea
            className="editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
          />
        </section>

        <section className="preview-pane">
          <div className="pane-header">RENDER ZONE</div>
          <div className="preview-content markdown-body">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </section>
      </main>

      <div className="fab-container">
        <button
          className="coin-block"
          onClick={generatePDF}
          disabled={isGenerating}
          title="BUMP FOR PDF"
        >
          {isGenerating ? "..." : <Download size={32} color="#D65C28" />}
        </button>
      </div>

    </div>
  );
}
