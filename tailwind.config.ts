import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dourado: "#c9a84c",
        "dourado-escuro": "#a8863a",
        "verde-escuro": "#2d6a4f",
        "preto-principal": "#1a1a1a",
        "cinza-card": "#242424",
        "cinza-borda": "#333333",
      },
      fontFamily: {
        barlow: ["Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
