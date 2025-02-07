/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            outline: "rgba(0, 0, 0, 0.12)",
            footer: {
                background: "#0A1014",
                text: "#F2F9FF",
                border: "#1f2937",
            },
            fontFamily: {
                sans: ["Noto Sans JP", "sans-serif"],
            },
        },
    },
    plugins: [require("daisyui")],
};
