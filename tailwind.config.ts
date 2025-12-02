// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1D2D44",       // основной тёмно-синий
          dark: "#0D1321",          // ещё темнее для ховеров/акцентов
          textOnPrimary: "#F3F7FA", // текст на тёмном фоне
          bgSoft: "#F3F7FA",        // мягкий светлый фон блоков
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(13, 19, 33, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
