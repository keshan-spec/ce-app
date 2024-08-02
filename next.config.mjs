/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
            allowedOrigins: [
                'phpstack-889362-4370795.cloudwaysapps.com',
                'd3gv6k8qu6wcqs.cloudfront.net',
                'wordpress-889362-4267074.cloudwaysapps.com',
            ]
        },
    },
    images: {
        remotePatterns: [
            {
                hostname: 'woocommerce-940726-4696380.cloudwaysapps.com',
            },
            {
                hostname: 'phpstack-889362-4370795.cloudwaysapps.com',
            },
            {
                hostname: 'wordpress-889362-4267074.cloudwaysapps.com',
            },
            {
                hostname: 'd3gv6k8qu6wcqs.cloudfront.net',
            },
        ]
    }

};

export default nextConfig;
