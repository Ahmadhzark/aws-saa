import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Set this to '/<your-repo-name>/' for GitHub Pages project sites
// (e.g. https://<user>.github.io/aws-saa/). Build output goes to ./docs, so set
// Pages source to: main branch, /docs. HashRouter means deep links never 404.
const BASE = '/aws-saa/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'AWS SAA-C03 Progress',
        short_name: 'AWS SAA',
        description: 'A premium personal progress tracker for the AWS Certified Solutions Architect – Associate (SAA-C03) exam.',
        theme_color: '#2563eb',
        background_color: '#0a1020',
        display: 'standalone',
        orientation: 'portrait',
        scope: BASE,
        start_url: BASE,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg,woff2}'] },
    }),
  ],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
