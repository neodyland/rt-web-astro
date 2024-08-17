import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        react(),
        starlight({
            title: "RT Documentation",
        }),
    ],
});
