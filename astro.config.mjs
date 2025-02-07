import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
    site: "https://rt.neody.land/",
    integrations: [
        tailwind(),
        react(),
        starlight({
            title: "RT Documentation",
            favicon: "favicon.png",
        }),
    ],
});
