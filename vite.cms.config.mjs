import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import tailwindcss from "@tailwindcss/vite";

const previewBase = process.env.PR_PREVIEW_PATH || "/";
const adminBase = path.posix.join(previewBase, "admin/");

function copyImagesPlugin() {
  const srcDir = path.resolve("src/assets/images");
  const dests = [
    path.resolve("public/admin/src/assets/images"),
    // Also expose source assets at the site root so absolute /src/... URLs resolve in dev.
    path.resolve("public/src/assets/images"),
  ];

  const contentTypeFor = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        return "image/jpeg";
      case ".png":
        return "image/png";
      case ".svg":
        return "image/svg+xml";
      case ".webp":
        return "image/webp";
      default:
        return "application/octet-stream";
    }
  };

  return {
    name: "cms-copy-images",
    /**
     * In dev, serve /src/assets/images/* directly from the repo so the Decap
     * image widget can fetch thumbnails without @ aliasing.
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "").split("?")[0];
        if (!url?.startsWith("/src/assets/images/")) return next();
        const filePath = path.resolve(url.slice(1)); // strip leading slash
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.setHeader("Content-Type", contentTypeFor(filePath));
        fs.createReadStream(filePath).pipe(res);
      });
    },
    buildStart() {
      if (!fs.existsSync(srcDir)) return;
      dests.forEach((destDir) => {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: adminBase,
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
