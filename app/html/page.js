"use client";

import { useState, useCallback } from "react";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HtmlWorld() {
    const [html, setHtml] = useState("<h1>Welcome to World 1-2</h1>\n<p>It's a me, HTML!</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>");
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
                body: JSON.stringify({ content: html, type: 'html' }),
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "mario-html.pdf";
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
                alignItems: 'center'
            }}>
                <Link href="/" style={{ color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <ArrowLeft size={16} /> BACK TO MAP
                </Link>
                <button className="nes-btn is-success" onClick={() => setHtml("")} style={{ padding: '0.5rem 1rem', fontSize: '10px' }}>RESET</button>
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
