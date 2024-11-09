import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(), legacy()],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      public: path.resolve(__dirname, "./public"),
      "@pixi/assets": "/node_modules/@pixi/assets",
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    target: "es2017",
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          tanstack: ["@tanstack/react-router", "@tanstack/react-query"],
          styles: ["clsx", "tailwind-merge"],
          // Additional manual chunks
          api: ["axios", "@/api"],
          telegram: ["@vkruglikov/react-telegram-web-app"],
          device: ["react-device-detect"],
          // Custom chunk for our own utility library
          // utils: ["@/utils"],
        },
      },
    },
  },
});
