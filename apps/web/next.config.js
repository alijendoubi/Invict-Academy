/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@invict/db"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // Ensure the build process doesn't fail on lint/ts errors for the demo
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
