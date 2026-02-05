import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: '#000',
            color: '#fff',
            padding: '24px',
            textAlign: 'center',
            borderTop: '4px solid #E52521',
            marginTop: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
                <a href="mailto:ab.zarinc@gmail.com" style={{ color: '#fff' }} title="Email"><Mail /></a>
                <a href="https://github.com/AbdulAHAD968" target="_blank" style={{ color: '#fff' }} title="GitHub"><Github /></a>
                <a href="https://www.linkedin.com/in/abdulahad-zarinc/" target="_blank" style={{ color: '#fff' }} title="LinkedIn"><Linkedin /></a>
            </div>

            <div style={{ fontSize: '10px', textTransform: 'uppercase', marginBottom: '16px' }}>
                © {currentYear} Super PDF World. All Rights Reserved.
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '10px' }}>
                <Link href="/privacy" style={{ color: '#aaa', textDecoration: 'none' }}>Privacy Policy</Link>
                <span>|</span>
                <Link href="/data-processing" style={{ color: '#aaa', textDecoration: 'none' }}>Data Processing</Link>
            </div>
        </footer>
    );
}
