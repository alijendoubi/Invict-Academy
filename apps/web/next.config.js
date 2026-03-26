/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    transpilePackages: ["@invict/db", "@invict/email"],

    // Ensure Node.js-only packages (BullMQ, ioredis) are not bundled by webpack
    serverExternalPackages: ["bullmq", "ioredis"],

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
