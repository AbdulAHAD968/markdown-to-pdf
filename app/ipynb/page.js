"use client";

import { useState, useCallback } from "react";
import { Download, ArrowLeft, FileCode, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function JupyterWorld() {
  const [notebook, setNotebook] = useState(null);
  const [fileName, setFileName] = useState("");
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
    if (file && file.name.endsWith(".ipynb")) {
      loadNotebook(file);
    } else {
      alert("Only .ipynb files allowed in World 3-1!");
    }
  }, []);

  const loadNotebook = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        JSON.parse(event.target.result); 
        setNotebook(event.target.result);
        setFileName(file.name);
      } catch (e) {
        alert("Invalid Jupyter Notebook file!");
      }
    };
    reader.readAsText(file);
  };

  const generatePDF = async () => {
    if (!notebook) {
      alert("Please upload a notebook first!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: notebook,
          type: 'ipynb',
          format,
          landscape
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate PDF");
      }

      const blob = new Blob([await response.arrayBuffer()], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().getTime();
      a.download = `jupyter-${fileName.replace(".ipynb", "")}-${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Game Over: " + error.message);
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
        <div className="drag-overlay" style={{ background: 'rgba(67, 176, 71, 0.8)', color: '#fff' }}>
          DROP NOTEBOOK TO WARP
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
          <label className="nes-btn is-success" style={{ padding: '0.5rem 1rem', fontSize: '10px', margin: 0 }}>
            INSERT .IPYNB
            <input
              type="file"
              accept=".ipynb"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) loadNotebook(file);
              }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#fff', border: '2px solid #000', padding: '5px 15px', borderRadius: '4px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold' }}>POTION CONFIG:</div>
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

        <button className="nes-btn" onClick={() => { setNotebook(null); setFileName(""); }} style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#fff' }}>CLEAR</button>
      </div>

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px',
        background: '#e8f5e9',
        position: 'relative'
      }}>
        <div className="nes-container" style={{ 
          width: '100%', 
          maxWidth: '600px', 
          textAlign: 'center', 
          padding: '50px',
          background: '#fff',
          boxShadow: '10px 10px 0 #000'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--mario-green)', textShadow: '2px 2px 0 #eee' }}>
            WORLD 3-1: JUPYTER WARP
          </div>
          
          {notebook ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ color: 'var(--mario-green)' }}>
                <CheckCircle2 size={64} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{fileName}</div>
              <p style={{ fontSize: '10px', color: '#666' }}>NOTEBOOK LOADED AND READY FOR WARP</p>
              <button 
                className="nes-btn is-primary"
                onClick={generatePDF}
                disabled={isGenerating}
                style={{ marginTop: '20px', padding: '12px 30px' }}
              >
                {isGenerating ? "WARPING..." : "WARP TO PDF"}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ color: '#ccc' }}>
                <FileCode size={80} strokeWidth={1} />
              </div>
              <p style={{ fontSize: '10px', color: '#666', lineHeight: '1.6' }}>
                DRAG & DROP YOUR .IPYNB FILE HERE<br/>
                OR USE THE "INSERT" BUTTON ABOVE
              </p>
            </div>
          )}
        </div>
        
        
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '3rem' }}>🧪</div>
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '3rem' }}>🔬</div>
      </main>

      <div className="fab-container">
        <button
          className="coin-block"
          onClick={generatePDF}
          disabled={isGenerating || !notebook}
          title="BUMP FOR PDF"
          style={{ background: notebook ? 'var(--mario-yellow)' : '#ccc' }}
        >
          {isGenerating ? "..." : <Download size={32} color={notebook ? "#D65C28" : "#999"} />}
        </button>
      </div>

    </div>
  );
}
