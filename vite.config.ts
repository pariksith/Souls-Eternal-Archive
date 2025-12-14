import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // ✅ PWA Plugin Added
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "/favicon.png",
        "/favicon.png.192x192.png",
        "/favicon.png.512x512.png",
      ],
      manifest: {
        name: "Soul's Eternal Archive",
        short_name: "SEA",
        description: "Your private offline encrypted diary",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/favicon.png.192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon.png.512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style",
            handler: "CacheFirst",
            options: {
              cacheName: "app-shell",
              expiration: { maxEntries: 50 },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "image" ||
              request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "assets",
              expiration: { maxEntries: 100 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

