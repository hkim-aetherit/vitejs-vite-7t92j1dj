import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['talkple-logo-24.png', 'talkple-logo-64.png'],
      manifest: {
        name: 'TalkPle',
        short_name: 'TalkPle',
        description: 'Connect with friends through video calls and public chats',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'talkple-logo-64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'talkple-logo-24.png',
            sizes: '24x24',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});