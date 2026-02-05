export default function Privacy() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', background: '#fff', border: '4px solid #000', marginTop: '40px', boxShadow: '8px 8px 0 #000' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '4px solid #E52521', paddingBottom: '10px' }}>PRIVACY POLICY</h1>

            <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', marginBottom: '16px' }}>
                <strong>Effective Date:</strong> Now
            </p>

            <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', marginBottom: '16px' }}>
                At Super PDF World, we take your privacy seriously. This application is designed with privacy in mind.
            </p>

            <h2 style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>1. Data Collection</h2>
            <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', marginBottom: '16px' }}>
                We do not collect, store, or share any personal data. We do not use cookies or tracking technologies.
            </p>

            <h2 style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>2. Content Processing</h2>
            <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', marginBottom: '16px' }}>
                The conversion process happens via a stateless serverless function. Your Markdown or HTML content is sent to the server solely for the purpose of generating the PDF and is immediately discarded. No copies are saved.
            </p>

            <h2 style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>3. Third-Party Services</h2>
            <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', marginBottom: '16px' }}>
                The application is hosted on Vercel. Please refer to Vercel's privacy policy for information regarding their infrastructure.
            </p>
        </div>
    );
}
