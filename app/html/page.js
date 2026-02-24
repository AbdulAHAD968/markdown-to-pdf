"use client";

import { useState, useCallback } from "react";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HtmlWorld() {
    const [html, setHtml] = useState("<h1>Welcome to World 1-2</h1>\n<p>It's a me, HTML!</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>");
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
        if (file && file.type === "text/html") {
            const reader = new FileReader();
            reader.onload = (event) => setHtml(event.target.result);
            reader.readAsText(file);
        } else {
            alert("Only .html files allowed in World 1-2!");
        }
    }, []);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: html,
                    type: 'html',
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
            a.download = `mario-html-${timestamp}.pdf`;
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
                <div className="drag-overlay" style={{ background: 'rgba(4, 156, 216, 0.8)', color: '#fff' }}>
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
                    <label className="nes-btn is-success" style={{ padding: '0.5rem 1rem', fontSize: '10px', margin: 0 }}>
                        IMPORT HTML
                        <input
                            type="file"
                            accept=".html"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => setHtml(event.target.result);
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

                <button className="nes-btn" onClick={() => setHtml("")} style={{ padding: '0.5rem 1rem', fontSize: '10px', background: '#fff' }}>RESET</button>
            </div>

            <main className="main-content">
                <section className="editor-pane">
                    <div className="pane-header" style={{ background: 'var(--mario-green)' }}>HTML CODE ZONE</div>
                    <textarea
                        className="editor"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        spellCheck={false}
                    />
                </section>

                <section className="preview-pane">
                    <div className="pane-header" style={{ background: 'var(--mario-green)' }}>RENDER ZONE</div>
                    <div
                        className="preview-content markdown-body"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </section>
            </main>

            <div className="fab-container">
                <button
                    className="coin-block"
                    onClick={generatePDF}
                    disabled={isGenerating}
                    title="BUMP FOR PDF"
                    style={{ background: 'var(--mario-green)', color: '#fff' }}
                >
                    {isGenerating ? "..." : <Download size={32} color="#fff" />}
                </button>
            </div>

        </div>
    );
}
