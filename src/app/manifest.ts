import { MetadataRoute } from 'next';

/**
 * @fileOverview Production-Grade PWA Manifest v18.0 (Hardened).
 * FIXED: Implemented specific maskable purpose with safe-area optimizations to ensure 
 * launcher icons match the visual scale of popular native apps.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cracklix | Punjab's Smart Mock Test Platform",
    short_name: 'Cracklix',
    description: "Punjab's most trusted government exam preparation platform. PSSSB, PPSC, Punjab Police, and more.",
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1677FF',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      }
    ],
    categories: ['education', 'lifestyle', 'productivity']
  };
}
