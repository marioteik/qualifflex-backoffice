import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import * as path from "node:path";
import Unfonts from "unplugin-fonts/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_PATH || "/",
    build: {
      target: "esnext",
    },
    plugins: [
      svgr(),
      react({
        include: ["./src/**/*.tsx", "./src/**/*.ts"],
      }),
      Unfonts({
        custom: {
          families: [
            {
              name: "Geist",
              src: "./src/assets/fonts/geist/*.woff2",
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
    preview: {
      port: 3000,
      strictPort: true,
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:3000",
    },
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
  };
});
