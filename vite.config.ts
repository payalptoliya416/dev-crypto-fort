import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Crypto's Fort",
        short_name: "Crypto's Fort",
        start_url: "/",
        scope: "/",
        background_color: "#25C866",
        "display": "minimal-ui",
        icons: [
          {
            src: "/192icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/512icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
