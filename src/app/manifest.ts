
import { MetadataRoute } from 'next';

/**
 * @fileOverview Optimized Institutional PWA Manifest v19.0.
 * FIXED: Updated icon source to high-quality transparent node to resolve mobile masking issues.
 */
export default function manifest(): MetadataRoute.Manifest {
  const brandIcon = 'https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png';

  return {
    name: "Cracklix | Punjab's Mock Test Platform",
    short_name: 'Cracklix',
    description: "Punjab's most trusted government exam preparation platform.",
    start_url: '/',
    id: 'cracklix-hub',
    display: 'standalone',
    background_color: '#0B1528',
    theme_color: '#0B1528',
    orientation: 'portrait',
    icons: [
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
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Practice Tests',
        url: '/mocks',
        description: 'Browse all available practice tests',
      },
      {
        name: 'Current Affairs',
        url: '/current-affairs',
        description: 'Daily exam relevant updates',
      },
    ],
    related_applications: [],
    prefer_related_applications: false
  };
}
