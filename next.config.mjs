/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
            allowedOrigins: ['phpstack-889362-4370795.cloudwaysapps.com']
        },
    },
};

export default nextConfig;
