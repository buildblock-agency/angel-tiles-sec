import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.28.77.194', '10.28.77.194:3000'],
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
};

export default nextConfig;
