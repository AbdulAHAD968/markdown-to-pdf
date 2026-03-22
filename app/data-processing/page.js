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

                <p style={{ marginTop: '24px' }}>
                    <strong>Data Retention Policy</strong><br />
                    While our standard conversion process is ephemeral, any items you choose to save in public repositories (Warp Box or Toad's Paste) as a guest are retained for exactly 24 hours. After this period, they are automatically purged from our database and Cloudinary storage. Registered users can manage their own data retention settings for private items.
                </p>
            </div>

        </div>
    );
}
