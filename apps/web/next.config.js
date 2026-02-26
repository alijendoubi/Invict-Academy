/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    transpilePackages: ["@invict/db"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // Move these to a more standard Next.js 14 format
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
