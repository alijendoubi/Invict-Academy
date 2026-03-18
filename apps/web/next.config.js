/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    transpilePackages: ["@invict/db", "@invict/email"],

    // Ensure Node.js-only packages (BullMQ, ioredis, twilio) are not bundled by webpack
    serverExternalPackages: ["bullmq", "ioredis", "twilio"],

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
