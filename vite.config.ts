import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base './' so the built site works from any path (GitHub Pages included)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Quest Tree — a family field guide to launching',
        short_name: 'Quest Tree',
        description:
          'A skill tree for raising kids genuinely ready to leave home, plus the Emancipation Track — freedoms handed over by age, unconditionally.',
        theme_color: '#f6f0e4',
        background_color: '#f6f0e4',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // precache the whole build — the app is fully static and local-first,
        // so offline it behaves exactly like online
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
      },
    }),
  ],
})
