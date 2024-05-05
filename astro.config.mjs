import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import { seoConfig } from "./src/utils/seoConfig";
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db(), icon(), react()],
  output: "server",
  adapter: vercel(),
  site: seoConfig.baseURL,
  vite: {
    optimizeDeps: {
      exclude: ["astro:db"]
    }
  }
});