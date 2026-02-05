export default function DataProcessing() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', background: '#fff', border: '4px solid #000', marginTop: '40px', boxShadow: '8px 8px 0 #000' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '4px solid #E52521', paddingBottom: '10px' }}>DATA PROCESSING</h1>

            <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '16px' }}>
                    <strong>How we handle your data:</strong>
                </p>

                <ul style={{ listStyle: 'square', paddingLeft: '20px', marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}>INPUT: You upload a content string (Markdown or HTML).</li>
                    <li style={{ marginBottom: '8px' }}>PROCESS: Our serverless function spins up a headless browser instance.</li>
                    <li style={{ marginBottom: '8px' }}>RENDER: The browser renders your content to visual HTML.</li>
                    <li style={{ marginBottom: '8px' }}>PRINT: The browser "prints" this to a PDF buffer.</li>
                    <li style={{ marginBottom: '8px' }}>OUTPUT: The PDF buffer is streamed back to you.</li>
                    <li style={{ marginBottom: '8px' }}>DELETION: The serverless function terminates, and all memory is wiped.</li>
                </ul>

                <p>
                    <strong>Client-Side Only?</strong><br />
                    While the PDF generation technically happens on a server (because browsers cannot reliably generate high-fidelity PDFs client-side without heavy libraries), the process is ephemeral and stateless. It effectively acts like a client-side tool.
                </p>
            </div>
        </div>
    );
}
