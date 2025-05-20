import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vercel from "vite-plugin-vercel"; // ✅ Important for Vercel

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: process.env.PORT ? Number(process.env.PORT) : 8080, // ✅ Respect Vercel port
  },
  plugins: [
    react(),
    mode === "production" && vercel(),        // ✅ Only for Vercel builds
    mode === "development" && componentTagger(), // ✅ Only for local dev
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}) as UserConfig); // Explicitly cast to UserConfig
