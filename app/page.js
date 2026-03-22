import Link from "next/link";

export const metadata = {
    description: "Welcome to Super PDF World. Convert files, share snippets, and warp URLs to PDF.",
};

export default function Home() {
    return (
        <div className="world-select-container">
            
            <div className="mario-clouds">
                <div className="cloud cloud-1">☁️</div>
                <div className="cloud cloud-2">☁️</div>
                <div className="cloud cloud-3">☁️</div>
            </div>

            <div className="world-title-wrapper">
                <div className="coin-decoration">🪙</div>
                <div className="world-title">
                    SUPER PDF WORLD
                </div>
                <div className="coin-decoration">🪙</div>
            </div>

            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-label-title">LEVEL 1-3: PDF POWER-UPS</div>
                    <div className="section-subtitle">CONVERT TEXT, CODE, AND WEBSITES TO PDF</div>
                </div>

                <div className="level-select">
                    <Link href="/markdown" className="level-card level-card-red">
                        <div className="card-inner">
                            <div className="level-icon">📝</div>
                            <div className="level-title">1-1: MARKDOWN</div>
                            <div className="level-description">Text to Pro PDF</div>
                        </div>
                    </Link>

                    <Link href="/html" className="level-card level-card-red">
                        <div className="card-inner">
                            <div className="level-icon">🌐</div>
                            <div className="level-title">1-2: HTML</div>
                            <div className="level-description">HTML to PDF</div>
                        </div>
                    </Link>

                    <Link href="/url" className="level-card level-card-blue">
                        <div className="card-inner">
                            <div className="level-icon">🔵</div>
                            <div className="level-title">2-1: WARP PIPE</div>
                            <div className="level-description">URL to PDF</div>
                        </div>
                    </Link>

                    <Link href="/ipynb" className="level-card level-card-green">
                        <div className="card-inner">
                            <div className="level-icon">🧪</div>
                            <div className="level-title">3-1: JUPYTER</div>
                            <div className="level-description">Notebook to PDF</div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="mario-divider">
                <span className="divider-brick">🟫</span>
                <span className="divider-brick">🟫</span>
                <span className="divider-brick">🟫</span>
            </div>

            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-label-title">LEVEL 4: COMMUNITY UTILITIES</div>
                    <div className="section-subtitle">STORE AND SHARE FILES OR SNIPPETS</div>
                </div>

                <div className="level-select">
                    <Link href="/warp-box" className="level-card level-card-orange">
                        <div className="card-inner">
                            <div className="level-icon">📦</div>
                            <div className="level-title">4-1: WARP BOX</div>
                            <div className="level-description">Cloud Storage</div>
                        </div>
                    </Link>

                    <Link href="/toads-paste" className="level-card level-card-yellow">
                        <div className="card-inner">
                            <div className="level-icon">📋</div>
                            <div className="level-title">4-2: TOAD'S PASTE</div>
                            <div className="level-description">Pastebin & Snippets</div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="start-prompt">
                <span className="prompt-arrow">▶</span> SELECT A WORLD TO START <span className="prompt-arrow">◀</span>
            </div>
        </div>
    );
}


