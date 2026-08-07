import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      includeAssets: ['favicon.svg', 'favicon.ico', 'icons/apple-touch-icon-180.png'],
      manifest: {
        name: 'ปวดเฮด',
        short_name: 'ปวดเฮด',
        description: 'บันทึกและวิเคราะห์อาการปวดหัว',
        lang: 'th',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#F8F7F4',
        theme_color: '#D97757',
        orientation: 'portrait',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    port: Number(process.env.PORT) || 3211,
  },
})
