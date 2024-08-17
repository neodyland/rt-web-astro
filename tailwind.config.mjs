/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "node_modules/@neodyland/ui/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            /*
			 Theme のカスタマイズ
			  以下のカラーを変更できる
	  
			  - primary: ボタンやリンクなどのアクセントカラー (default: #6200ee)
			  - on-primary: primary のテキストカラー (default: #ffffff)
			  - secondary: ボタンやリンクなどのセカンダリカラー (default: #03dac4)
			  - on-secondary: secondary のテキストカラー (default: #000000)
			  - tertiary: ボタンやリンクなどの第三カラー (default: #3cf6e7ff)
			  - on-tertiary: tertiary のテキストカラー (default: #000000)
			  - background: 背景色 (default: #F2F9FF)
			  - on-background: background のテキストカラー (default: #0A1014)
			  - surface: card や modal の背景色 (default: #ffffff)
			  - on-surface: surface のテキストカラー (default: #000000)
			  - outline: border の色 (default: rgba(0, 0, 0, 0.12))
			  - footer: footer に関する
				- background: 背景色 (default: #0A1014)
				- text: テキストカラー (default: #F2F9FF)
				- border: border の色 (default: #1f2937)
	  
			  primary, secondary, tertiary は、各component の colorScheme で指定できる
			*/
            primary: "#6200ee",
            "on-primary": "#ffffff",
            secondary: "#03dac4",
            "on-secondary": "#000000",
            tertiary: "#3cf6e7ff",
            "on-tertiary": "#000000",
            background: "#F2F9FF",
            "on-background": "#0A1014",
            surface: "#ffffff",
            "on-surface": "#000000",
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
    plugins: [require("@neodyland/ui/plugin")],
};
