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
};

module.exports = nextConfig;
