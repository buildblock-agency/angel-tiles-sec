import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.28.77.194', '10.28.77.194:3000','100.100.100.191'],
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536, 1920],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
  },
  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      fs: {
        browser: "./src/mocks/empty.ts",
      },
      path: {
        browser: "./src/mocks/empty.ts",
      },
      crypto: {
        browser: "./src/mocks/empty.ts",
      },
      sharp: {
        browser: "./src/mocks/empty.ts",
      },
      "onnxruntime-node": {
        browser: "./src/mocks/empty.ts",
      },
    },
  },
  // Webpack fallback configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        fs: false,
        path: false,
        crypto: false,
        sharp: false,
        "onnxruntime-node": false,
      };
    }
    return config;
 },
  async headers() {
    return [
      {
        source: '/:all*(webp|png|jpg|jpeg|gif|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
