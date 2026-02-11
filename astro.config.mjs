// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    site: "https://moosyu.github.io",
    server: {
        port: 5501
    },
    devToolbar: {
        enabled: false
    },
    integrations: [sitemap(), mdx()]
});