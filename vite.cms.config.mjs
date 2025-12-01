import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/admin/",
  build: {
    outDir: "public/admin",
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: path.resolve("src/admin/preview.tsx"),
      output: {
        entryFileNames: "preview.bundle.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "preview.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve("src"),
      "clean-stack": path.resolve("src/admin/stubs/clean-stack.ts"),
    },
  },
  define: {
    __CMS_ROOT__: JSON.stringify(process.cwd()),
  },
});
