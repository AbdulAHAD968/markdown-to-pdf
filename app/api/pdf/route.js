import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { marked } from 'marked';


marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
  mangle: false,
  headerIds: true,
  silent: false,
});

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { content, type, format = 'A4', landscape = false, url } = await req.json();

    if (!content && type !== 'url') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (type === 'url' && !url) {
      return NextResponse.json({ error: 'URL is required for URL mode' }, { status: 400 });
    }

    let htmlContent = '';

    if (type === 'markdown') {
      htmlContent = marked.parse(content);
    } else if (type === 'html') {
      htmlContent = content;
    } else if (type === 'url') {
      
    } else {
      return NextResponse.json({ error: 'Invalid type. Must be "markdown", "html", or "url"' }, { status: 400 });
    }

    let browser;
    const isLocal = process.env.NODE_ENV === 'development';

    if (isLocal) {
      browser = await puppeteer.launch({
        channel: 'chrome',
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      });
    } else {
      chromium.setGraphicsMode = false;
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    if (type === 'url') {
      await page.goto(url, { waitUntil: 'networkidle0' });
    } else {
      const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-light.min.css">
              <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap" rel="stylesheet">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
              <style>
                * {
                  box-sizing: border-box;
                }
                
                @page {
                  margin: 20mm;
                  size: ${format}${landscape ? ' landscape' : ''};
                }
                
                html, body {
                  margin: 0;
                  padding: 0;
                }
                
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
                  font-size: 11pt;
                  line-height: 1.6;
                  color: #24292e;
                  background: white;
                }
                
                .markdown-body {
                  max-width: 100%;
                  padding: 0;
                  background: white;
                  color: #24292e;
                }
                
                /* Headings */
                .markdown-body h1,
                .markdown-body h2,
                .markdown-body h3,
                .markdown-body h4,
                .markdown-body h5,
                .markdown-body h6 {
                  margin-top: 24pt;
                  margin-bottom: 12pt;
                  font-weight: 700;
                  line-height: 1.25;
                  page-break-after: avoid;
                  border-bottom: none;
                  padding-bottom: 0;
                }
                
                .markdown-body h1 {
                  font-size: 28pt;
                  border-bottom: 2px solid #eaecef;
                  padding-bottom: 10pt;
                }
                
                .markdown-body h2 {
                  font-size: 20pt;
                  border-bottom: 1px solid #eaecef;
                  padding-bottom: 8pt;
                }
                
                .markdown-body h3 {
                  font-size: 16pt;
                }
                
                .markdown-body h4 {
                  font-size: 14pt;
                }
                
                .markdown-body h5,
                .markdown-body h6 {
                  font-size: 12pt;
                }
                
                /* Paragraphs */
                .markdown-body p {
                  margin: 0 0 12pt 0;
                  line-height: 1.6;
                }
                
                /* Lists */
                .markdown-body ul,
                .markdown-body ol {
                  margin: 12pt 0;
                  padding-left: 2em;
                }
                
                .markdown-body li {
                  margin: 6pt 0;
                  line-height: 1.6;
                }
                
                .markdown-body ul li {
                  list-style-type: disc;
                }
                
                .markdown-body ol li {
                  list-style-type: decimal;
                }
                
                .markdown-body ul ul li {
                  list-style-type: circle;
                }
                
                .markdown-body ul ul ul li {
                  list-style-type: square;
                }
                
                /* Code */
                .markdown-body code {
                  padding: 2pt 6pt;
                  background-color: #f6f8fa;
                  border-radius: 3px;
                  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
                  font-size: 10pt;
                  color: #24292e;
                }
                
                .markdown-body pre {
                  background-color: #f6f8fa;
                  border: 1px solid #ddd;
                  border-radius: 3px;
                  padding: 12pt;
                  margin: 12pt 0;
                  overflow-x: auto;
                  line-height: 1.45;
                  page-break-inside: avoid;
                }
                
                .markdown-body pre code {
                  background-color: transparent;
                  padding: 0;
                  margin: 0;
                  border: 0;
                  border-radius: 0;
                  font-size: 9pt;
                  display: block;
                  overflow-x: auto;
                }
                
                /* Blockquotes */
                .markdown-body blockquote {
                  margin: 12pt 0;
                  padding: 0 1em;
                  border-left: 4px solid #ddd;
                  color: #6a737d;
                  page-break-inside: avoid;
                }
                
                .markdown-body blockquote p {
                  margin: 0;
                }
                
                /* Links */
                .markdown-body a {
                  color: #0366d6;
                  text-decoration: none;
                }
                
                .markdown-body a:visited {
                  color: #6f42c1;
                }
                
                /* Tables */
                .markdown-body table {
                  border-collapse: collapse;
                  width: 100%;
                  margin: 12pt 0;
                  page-break-inside: avoid;
                }
                
                .markdown-body table tr {
                  border-top: 1px solid #ddd;
                }
                
                .markdown-body table td,
                .markdown-body table th {
                  border: 1px solid #ddd;
                  padding: 8pt;
                  text-align: left;
                }
                
                .markdown-body table th {
                  background-color: #f6f8fa;
                  font-weight: 700;
                }
                
                /* Horizontal rule */
                .markdown-body hr {
                  height: 0;
                  margin: 24pt 0;
                  overflow: hidden;
                  background: transparent;
                  border: 0;
                  border-bottom: 1px solid #ddd;
                }
                
                /* Images */
                .markdown-body img {
                  max-width: 100%;
                  height: auto;
                  display: block;
                  page-break-inside: avoid;
                }
                
                /* Task lists */
                .markdown-body .task-list-item {
                  list-style: none;
                  margin-left: 0;
                  padding-left: 1.5em;
                  position: relative;
                }
                
                .markdown-body .task-list-item input[type="checkbox"] {
                  position: absolute;
                  left: 0;
                  top: 3pt;
                }
                
                /* Emphasis */
                .markdown-body strong {
                  font-weight: 700;
                }
                
                .markdown-body em {
                  font-style: italic;
                }
              </style>
            </head>
            <body class="markdown-body">
              ${htmlContent}
            </body>
          </html>
        `;
      await page.setContent(html, { waitUntil: 'networkidle0' });
    }


    const pdfBuffer = await page.pdf({
      format: format,
      landscape: landscape,
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment',
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
