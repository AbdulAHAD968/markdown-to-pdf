"use client";

import { useState } from "react";
import { Download, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";

export default function UrlWorld() {
    const [url, setUrl] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [format, setFormat] = useState("A4");
    const [landscape, setLandscape] = useState(false);

    const generatePDF = async () => {
        if (!url) {
            alert("Please enter a URL to warp!");
            return;
        }

        setIsGenerating(true);
        try {
            
            const validUrl = url.startsWith('http') ? url : `https://${url}`;

            const response = await fetch("/api/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: 'url',
                    url: validUrl,
                    format,
                    landscape
                }),
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = new Blob([await response.arrayBuffer()], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;

            
            const cleanUrl = url.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 20);
            a.download = `warp-${cleanUrl || 'page'}-${Date.now()}.pdf`;

            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
            }, 100);
        } catch (error) {
            console.error(error);
            alert("Game Over: Warp Failed. Please check the URL.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--sky-blue)', zIndex: 1000, overflow: 'hidden' }}>
            
            <div style={{
                padding: '12px 24px',
                background: '#fff',
                borderBottom: '4px solid #000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
            }}>
                <Link href="/" style={{ color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '10px' }}>
                    <ArrowLeft size={16} /> BACK TO WORLD MAP
                </Link>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#f5f5f5', border: '3px solid #000', padding: '4px 12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 'bold' }}>CONFIG:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '8px' }}>SIZE</span>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            style={{ padding: '2px', fontSize: '9px', border: '2px solid #000', background: '#fff' }}
                        >
                            <option value="A4">A4</option>
                            <option value="Letter">LETTER</option>
                            <option value="Legal">LEGAL</option>
                        </select>
                    </div>
                    <button
                        className={`nes-btn ${landscape ? 'is-success' : ''}`}
                        onClick={() => setLandscape(!landscape)}
                        style={{ padding: '2px 6px', fontSize: '8px', boxShadow: '2px 2px 0 #000' }}
                    >
                        {landscape ? "LANDSCAPE" : "PORTRAIT"}
                    </button>
                </div>

                <button className="nes-btn" onClick={() => setUrl("")} style={{ padding: '4px 10px', fontSize: '10px', background: '#fff' }}>CLEAR</button>
            </div>

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative'
            }}>
                <div className="nes-container" style={{
                    width: '100%',
                    maxWidth: '550px',
                    textAlign: 'center',
                    padding: '30px',
                    background: '#fff',
                    boxShadow: '10px 10px 0 rgba(0,0,0,0.3)',
                    zIndex: 2
                }}>
                    <div style={{
                        fontSize: '1.2rem',
                        marginBottom: '15px',
                        color: 'var(--mario-red)',
                        textShadow: '2px 2px 0 #eee'
                    }}>
                        WORLD 2-1: WARP PIPE
                    </div>
                    <p style={{ fontSize: '9px', marginBottom: '25px', color: '#666', lineHeight: '1.5' }}>PASTE A URL TO "WARP" ANY WEBPAGE INTO A HIGH-QUALITY PDF DOCUMENT</p>

                    <div style={{ position: 'relative', width: '100%', marginBottom: '25px' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#000', zIndex: 1 }}>
                            <Globe size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                border: '4px solid #000',
                                fontFamily: 'inherit',
                                fontSize: '14px',
                                outline: 'none',
                                background: '#fff',
                                boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.05)',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        className="nes-btn is-primary"
                        onClick={generatePDF}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            fontSize: '14px'
                        }}
                    >
                        {isGenerating ? "WARPING..." : "WARP TO PDF"}
                    </button>
                </div>

                
                <div style={{
                    position: 'absolute',
                    bottom: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '12rem',
                    color: 'var(--mario-green)',
                    textShadow: '6px 0 0 #000',
                    zIndex: 1,
                    pointerEvents: 'none',
                    opacity: 0.8
                }}>管</div>
            </main>

            <div className="fab-container" style={{ bottom: '20px', right: '20px' }}>
                <button
                    className="coin-block"
                    onClick={generatePDF}
                    disabled={isGenerating}
                    style={{ background: 'var(--mario-yellow)', width: '50px', height: '50px' }}
                >
                    {isGenerating ? "..." : <Download size={32} color="#D65C28" />}
                </button>
            </div>
        </div>
    );
}
