import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

import { FirebaseClientProvider } from "@/firebase/client-provider";

import MobileNav from "@/components/layout/MobileNav";
import PWAManager from "@/components/pwa/PWAManager";

import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * @fileOverview Root Layout v46.0.
 * UPDATED: Optimized metadata to resolve title bar duplication and updated icons to new brand identity.
 */
export const metadata: Metadata = {
  title: "Cracklix | Punjab's Smart Mock Test Platform",

  description:
    "Punjab's most trusted government exam preparation platform. PSSSB, PPSC, Punjab Police, Patwari, Clerk and more.",

  manifest: "/manifest.json",

  icons: {
    icon: [
      {
        url: "/logo/cracklix-icon.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo/cracklix-icon.png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cracklix",
  },

  applicationName: "Cracklix",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1677FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          font-body
          antialiased
          bg-white
          text-[#0F172A]
          min-h-screen
          overflow-x-hidden
          pb-[90px]
          md:pb-0
        `}
      >
        <FirebaseClientProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav />

          {/* PWA Manager */}
          <PWAManager />

          {/* Toasts */}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
