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
        domains: [
            'phpstack-889362-4370795.cloudwaysapps.com',
            'wordpress-889362-4267074.cloudwaysapps.com',
            'd3gv6k8qu6wcqs.cloudfront.net',
            'woocommerce-940726-4696380.cloudwaysapps.com',
        ]
    }

};

export default nextConfig;
