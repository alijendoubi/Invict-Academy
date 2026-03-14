/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    transpilePackages: ["@invict/db", "@invict/email"],
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
