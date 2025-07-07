/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'as1.ftcdn.net',           // For stock images
            'images.unsplash.com',     // For unsplash images
            'localhost',               // For local development
            '127.0.0.1',              // For local development
            'img.freepik.com',         // For freepik images
            'static.vecteezy.com',      // For vecteezy images
            'static.wixstatic.com',      // For wixstatic images
            'thumbs.dreamstime.com',      // For dreamstime images
            'drive.google.com',           // For Google Drive images
            'source.unsplash.com',         // For random unsplash images
            'lh3.googleusercontent.com'   // For Google profile images
        ],
    },
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = nextConfig 

// module.exports = withBundleAnalyzer({
//   // your existing Next config
//   nextConfig
// });