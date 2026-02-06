// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://moosyu.github.io",
    server: {
        port: 5501
    },
    integrations: [sitemap()]
});
