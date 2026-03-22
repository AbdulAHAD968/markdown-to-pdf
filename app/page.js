import Link from "next/link";

export const metadata = {
    description: "Welcome to Super PDF World. Convert files, share snippets, and warp URLs to PDF.",
};

export default function Home() {
    return (
        <div className="world-select-container" style={{ padding: '20px', maxWidth: '1000px', margin: '80px auto 0 auto' }}>
            <div className="world-title" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
                SUPER PDF WORLD
            </div>

            
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 0 #000' }}>LEVEL 1-3: PDF POWER-UPS</div>
                <div style={{ fontSize: '8px', color: '#fff', marginTop: '5px' }}>CONVERT TEXT, CODE, AND WEBSITES TO PDF</div>
            </div>
            
            <div className="level-select">
                <Link href="/markdown" className="level-card" style={{ width: '100%', minHeight: '150px' }}>
                    <div className="level-icon">📝</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>1-1: MARKDOWN</div>
                    <div style={{ fontSize: '8px', opacity: 0.7, textTransform: 'none' }}>Text to Pro PDF</div>
                </Link>

                <Link href="/html" className="level-card" style={{ width: '100%', minHeight: '150px' }}>
                    <div className="level-icon">🌐</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>1-2: HTML</div>
                    <div style={{ fontSize: '8px', opacity: 0.7, textTransform: 'none' }}>HTML to PDF</div>
                </Link>

                <Link href="/url" className="level-card" style={{ width: '100%', minHeight: '150px', boxShadow: '8px 8px 0 var(--mario-blue)' }}>
                    <div className="level-icon">管</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>2-1: WARP PIPE</div>
                    <div style={{ fontSize: '8px', opacity: 0.7, textTransform: 'none' }}>URL to PDF</div>
                </Link>

                <Link href="/ipynb" className="level-card" style={{ width: '100%', minHeight: '150px', boxShadow: '8px 8px 0 var(--mario-green)' }}>
                    <div className="level-icon">🧪</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>3-1: JUPYTER</div>
                    <div style={{ fontSize: '8px', opacity: 0.7, textTransform: 'none' }}>Notebook to PDF</div>
                </Link>
            </div>

            
            <hr className="nes-hr" style={{ margin: '40px 0', width: '100%' }} />

            
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 0 #000' }}>LEVEL 4: COMMUNITY UTILITIES</div>
                <div style={{ fontSize: '8px', color: '#fff', marginTop: '5px' }}>STORE AND SHARE FILES OR SNIPPETS</div>
            </div>

            <div className="level-select">
                <Link href="/warp-box" className="level-card" style={{ width: '100%', minHeight: '150px', boxShadow: '8px 8px 0 var(--mario-orange)' }}>
                    <div className="level-icon">📦</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>4-1: WARP BOX</div>
                    <div style={{ fontSize: '8px', opacity: 0.7, textTransform: 'none' }}>Cloud Storage</div>
                </Link>

                <Link href="/toads-paste" className="level-card" style={{ width: '100%', minHeight: '150px', boxShadow: '8px 8px 0 var(--mario-yellow)' }}>
                    <div className="level-icon">📋</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>4-2: TOAD'S PASTE</div>
                    <div style={{ fontSize: '8px', opacity: 0.7, textTransform: 'none' }}>Pastebin & Snippets</div>
                </Link>
            </div>

            <div style={{ marginTop: '3rem', fontSize: '10px', textTransform: 'uppercase', opacity: 0.7, color: '#fff' }}>
                SELECT A WORLD TO START
            </div>
        </div>
    );
}


