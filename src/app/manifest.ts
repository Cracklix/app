import { MetadataRoute } from 'next';

/**
 * @fileOverview Institutional PWA Manifest Configuration v9.0.
 * UPDATED: Fixed permanent image source for app icons with the new provider asset.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CRACKLIX | Punjab Exam Hub',
    short_name: 'CRACKLIX',
    description: "Punjab's most trusted government exam preparation platform.",
    start_url: '/',
    id: '/',
    display: 'standalone',
    background_color: '#0B1528',
    theme_color: '#0B1528',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'My Exams',
        url: '/my-exams',
        description: 'View your pinned exam hubs',
      },
      {
        name: 'Mock Tests',
        url: '/mocks',
        description: 'Browse all available practice tests',
      },
    ],
  };
}
