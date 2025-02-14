import type { NextConfig } from "next";
import withTM from "next-transpile-modules";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
        ],
    },
};

export default withTM(["three"])(nextConfig);
