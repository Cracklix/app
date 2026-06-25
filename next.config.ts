import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/, /_next\/static\/chunks\/.*\.map$/],
  reloadOnOnline: true,
});

/**
 * @fileOverview Next.js 15 Configuration for Static Export.
 * ENFORCED: output: 'export' for Capacitor compatibility.
 * ENFORCED: Authorized i.ibb.co for remote image rendering.
 */
const nextConfig: NextConfig = {
  output: 'export',
  
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "i.ibb.co", pathname: "/**" },
      { protocol: "https", hostname: "ibb.co", pathname: "/**" },
      { protocol: "https", hostname: "sssb.punjab.gov.in", pathname: "/**" },
      { protocol: "https", hostname: "joinindianarmy.nic.in", pathname: "/**" },
      { protocol: "https", hostname: "punjabpolice.gov.in", pathname: "/**" },
    ],
  },

  generateBuildId: async () => {
    return `cracklix-prod-${Date.now()}`;
  },

  poweredByHeader: false,
  compress: true,
};

export default withPWA(nextConfig);
