import Link from "next/link";

export default function Home() {
    return (
        <div className="world-select-container">
            <div className="world-title">
                SUPER PDF WORLD
            </div>

            <div className="level-select">
                <Link href="/markdown" className="level-card">
                    <div className="level-icon">📝</div>
                    <div>WORLD 1-1</div>
                    <div>MARKDOWN</div>
                </Link>

                <Link href="/html" className="level-card">
                    <div className="level-icon">🌐</div>
                    <div>WORLD 1-2</div>
                    <div>HTML</div>
                </Link>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                SELECT A WORLD TO START
            </div>
        </div>
    );
}
