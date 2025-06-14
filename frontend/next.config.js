/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'as1.ftcdn.net',           // For stock images
            'images.unsplash.com',     // For unsplash images
            'localhost',               // For local development
            '127.0.0.1',              // For local development
            'img.freepik.com',         // For freepik images
            'static.vecteezy.com',     // For vecteezy images
            'static.wixstatic.com',    // For wixstatic images
            'thumbs.dreamstime.com',   // For dreamstime images
            'yoga.krishna.com',        // For Krishna.com images
            'drive.google.com',         // For Google Drive images
            'vanimedia.org',           // For Vanimedia
            'w.vanimedia.org',         // For Vanimedia
            'lh3.googleusercontent.com' // For Google Drive direct image links
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yoga.krishna.com',
                pathname: '/en/images/**',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '/uc/**',
            },
            {
                protocol: 'https',
                hostname: 'vanimedia.org',
                pathname: '/w/images/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/d/**',
            },
        ],
    },
}

module.exports = nextConfig 