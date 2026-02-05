import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: '%s | Super PDF World',
    default: 'Super PDF World - Retro Markdown & HTML to PDF Converter',
  },
  description: 'Convert Markdown and HTML to PDF with a retro Super Mario theme. Free, private, and serverless PDF generation.',
  metadataBase: new URL('https://superpdfworld.vercel.app'),
  keywords: ['markdown to pdf', 'html to pdf', 'pdf converter', 'retro pdf', 'super mario theme', 'serverless pdf', 'puppeteer'],
  authors: [{ name: 'Abdul Ahad', url: 'https://github.com/AbdulAHAD968' }],
  creator: 'Abdul Ahad',
  openGraph: {
    title: 'Super PDF World',
    description: 'Convert Markdown and HTML to PDF with style. It\'s-a me, PDF!',
    url: '/',
    siteName: 'Super PDF World',
    images: [
      {
        url: '/markdown.png',
        width: 1200,
        height: 630,
        alt: 'Super PDF World Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super PDF World',
    description: 'Convert Markdown and HTML to PDF with a retro twist!',
    images: ['/markdown.png'],
  },
  icons: {
    icon: '/markdown.png',
    shortcut: '/markdown.png',
    apple: '/markdown.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
