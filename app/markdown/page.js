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
  const [format, setFormat] = useState("A4");
  const [landscape, setLandscape] = useState(false);

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
        body: JSON.stringify({
          content: markdown,
          type: 'markdown',
          format,
          landscape
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = new Blob([await response.arrayBuffer()], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().getTime();
      a.download = `mario-markdown-${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
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
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <ArrowLeft size={16} /> BACK TO MAP
          </Link>
          <label className="nes-btn is-primary" style={{ padding: '0.5rem 1rem', fontSize: '10px', margin: 0 }}>
            IMPORT MD
            <input
              type="file"
              accept=".md"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => setMarkdown(event.target.result);
                  reader.readAsText(file);
                }
              }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#fff', border: '2px solid #000', padding: '5px 15px', borderRadius: '4px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>MUSHROOM CONFIG:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px' }}>SIZE:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{ padding: '4px', fontSize: '10px', border: '2px solid #000', background: '#fff', fontFamily: 'inherit' }}
            >
              <option value="A4">A4</option>
              <option value="Letter">LETTER</option>
              <option value="Legal">LEGAL</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px' }}>ORIENTATION:</span>
            <button
              className={`nes-btn ${landscape ? 'is-success' : ''}`}
              onClick={() => setLandscape(!landscape)}
              style={{ padding: '4px 8px', fontSize: '10px', boxShadow: '2px 2px 0 #000' }}
            >
              {landscape ? "LANDSCAPE" : "PORTRAIT"}
            </button>
          </div>
        </div>

        <button className="nes-btn" onClick={() => setMarkdown("")} style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#fff' }}>RESET</button>
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
