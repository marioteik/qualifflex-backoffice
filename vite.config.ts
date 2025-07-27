import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import * as path from "node:path";
import Unfonts from "unplugin-fonts/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  console.log(`🔧 Vite Config - Mode: ${mode}`);
  console.log(`🔧 VITE_BASE_PATH: '${env.VITE_BASE_PATH}'`);
  console.log(`🔧 VITE_API_DOMAIN: '${env.VITE_API_DOMAIN}'`);
  console.log(`🔧 Using base path: '${env.VITE_BASE_PATH || "/"}'`);

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
