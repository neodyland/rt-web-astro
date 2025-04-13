import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
    site: "https://rt.neody.land/",
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [
        react(),
        starlight({
            title: "RT Documentation",
            favicon: "favicon.png",
        }),
    ],
});
