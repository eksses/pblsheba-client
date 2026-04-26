import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      includeAssets: ['app-icon.png', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'PBL Sheba Community',
        short_name: 'PBL Sheba',
        description: 'Secure digital platform for PBL Sheba Somaj members',
        theme_color: '#16a34a',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/app-icon.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/app-icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/app-icon.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
