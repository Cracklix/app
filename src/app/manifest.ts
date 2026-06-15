import { MetadataRoute } from 'next';

/**
 * @fileOverview Production-Grade PWA Manifest v3.0.
 */
export default function manifest(): MetadataRoute.Manifest {
  const brandIcon = '/logo/cracklix-logo.png';

  return {
    name: 'Cracklix',
    short_name: 'Cracklix',
    description: "Punjab's most trusted government exam preparation platform.",
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#081a3a',
    theme_color: '#081a3a',
    orientation: 'portrait',
    icons: [
      {
        src: brandIcon,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: brandIcon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: brandIcon,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: brandIcon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'lifestyle']
  };
}
