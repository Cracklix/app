
import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: '/offline.html',
  }
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Enabled only for Capacitor Android builds to bundle files locally
  output: process.env.NEXT_PUBLIC_ANDROID_APP ? 'export' : undefined,

  images: {
    unoptimized: process.env.NEXT_PUBLIC_ANDROID_APP ? true : false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  poweredByHeader: false,
  compress: true,
};

export default withPWA(nextConfig);
