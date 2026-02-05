export default function sitemap() {
    return [
        {
            url: 'https://superpdfworld.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://superpdfworld.vercel.app/markdown',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://superpdfworld.vercel.app/html',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]
}
