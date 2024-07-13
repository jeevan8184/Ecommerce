/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    experimental: {
        esmExternals: 'loose',
        serverComponentsExternalPackages: ["mongoose"]
    },
    images: {
        domains: ["res.cloudinary.com"],
    },
};

export default nextConfig;
