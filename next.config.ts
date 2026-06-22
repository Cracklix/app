
import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  poweredByHeader: false,
  compress: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallback for Node.js modules in client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
        dns: false,
        child_process: false,
        crypto: false,
        os: false,
        path: false,
        stream: false,
        zlib: false,
        'node:async_hooks': false,
        async_hooks: false,
        perf_hooks: false,
      };

      // Exclude Genkit and Opentelemetry from client bundle
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        {
          '@opentelemetry/context-async-hooks': 'commonjs @opentelemetry/context-async-hooks',
          'genkit': 'commonjs genkit',
          '@genkit-ai/google-genai': 'commonjs @genkit-ai/google-genai',
        },
      ];
    }
    return config;
  },
};

export default withPWA(nextConfig);
