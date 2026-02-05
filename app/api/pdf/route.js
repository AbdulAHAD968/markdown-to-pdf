import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { marked } from 'marked';

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { content, type } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    let htmlContent = '';

    if (type === 'markdown') {
      htmlContent = marked.parse(content);
    } else if (type === 'html') {
      htmlContent = content;
    } else {
      return NextResponse.json({ error: 'Invalid type. Must be "markdown" or "html"' }, { status: 400 });
    }


    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-light.min.css">
          <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
          <style>
            body {
              box-sizing: border-box;
              min-width: 200px;
              max-width: 980px;
              margin: 0 auto;
              padding: 45px;
            }
            @media (max-width: 767px) {
              .markdown-body {
                padding: 15px;
              }
            }
            .markdown-body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            }
            /* If type is HTML, we might want to preserve styles more naturally or allow custom styles? 
               For now, we wrap in markdown-body for consistency unless it's raw page. 
               But user might want raw HTML. Let's just wrap it for safety and styling. 
            */
            
            @page {
              margin: 0;
            }
          </style>
        </head>
        <body class="markdown-body">
          ${htmlContent}
        </body>
      </html>
    `;


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
    await page.setContent(html, { waitUntil: 'networkidle0' });

    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '40px',
        bottom: '40px',
        left: '40px',
        right: '40px'
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
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
