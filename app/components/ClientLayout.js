"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
    const pathname = usePathname();


    const isEditorPage = pathname.startsWith("/markdown") || pathname.startsWith("/html") || pathname.startsWith("/url");

    return (
        <div className={`app-container ${isEditorPage ? 'editor-mode' : ''}`}>
            {!isEditorPage && <Header />}
            {children}
            {!isEditorPage && <Footer />}
        </div>
    );
}
