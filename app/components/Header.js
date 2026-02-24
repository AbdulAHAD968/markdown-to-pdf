import Link from "next/link";

export default function Header() {
    return (
        <nav className="header" style={{
            background: 'linear-gradient(to bottom, #E52521, #D01010)',
            borderBottom: '4px solid #000',
            boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
            padding: '0 24px',
            margin: '0',
            zIndex: 10
        }}>
            <div className="logo">
                <Link href="/" style={{
                    textDecoration: 'none',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textShadow: '2px 2px 0 #000'
                }}>
                    <div style={{
                        background: '#fff',
                        border: '2px solid #000',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: '2px 2px 0 #000'
                    }}>🍄</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '20px', lineHeight: '1' }}>SUPER PDF</span>
                        <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#ffcccb' }}>THE PDF WONDERLAND</span>
                    </div>
                </Link>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
                <a href="https://github.com/AbdulAHAD968" target="_blank" className="nes-btn is-primary" style={{
                    padding: '8px 16px',
                    fontSize: '10px',
                    background: '#fff',
                    color: '#E52521',
                    borderColor: '#000'
                }}>
                    GITHUB
                </a>
            </div>
        </nav>
    );
}
