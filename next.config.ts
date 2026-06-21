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

  experimental: {
    allowedDevOrigins: [
      "9000-firebase-studio-1780356784378.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev",
      "*.cloudworkstations.dev"
    ]
  }
};

export default withPWA(nextConfig);
