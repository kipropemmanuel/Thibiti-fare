import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: {
        name: "ThibitiFare",
        short_name: "ThibitiFare",
        description: "Matatu fare payment requests and fraud verification, backed by M-Pesa Daraja.",
        theme_color: "#0a7a3e",
        background_color: "#f6f4ee",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ],
  server: {
    host: true // lets your phone reach the dev server over your local Wi-Fi
  }
});
