import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // @ts-expect-error: allowedDevOrigins is still experimental in typings
    allowedDevOrigins: [
      "http://localhost:9000",
      "http://localhost:9002",
      "https://9000-firebase-dliheapp-1756269100480.cluster-nulpgqge5rgw6rwqiydysl6ocy.cloudworkstations.dev",
    ],
  },
};

export default nextConfig;

