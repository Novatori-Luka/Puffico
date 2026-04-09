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
        // Puffico brand palette — natural, warm, handmade
        cream: {
          50:  "#fdfcf8",
          100: "#f8f4ec",
          200: "#f0e8d6",
          300: "#e5d5b8",
          400: "#d6be96",
          500: "#c4a474",
          DEFAULT: "#f8f4ec",
        },
        sand: {
          50:  "#faf8f3",
          100: "#f2ede0",
          200: "#e4d9c0",
          300: "#d1be96",
          400: "#bda06e",
          500: "#a8854e",
          600: "#8c6d3f",
          700: "#705633",
          DEFAULT: "#d1be96",
        },
        earth: {
          50:  "#f5f0ea",
          100: "#e8ddd0",
          200: "#d0bba0",
          300: "#b89470",
          400: "#9e7248",
          500: "#7d5835",
          600: "#634429",
          700: "#4a3220",
          800: "#33221a",
          DEFAULT: "#9e7248",
        },
        terracotta: {
          50:  "#fdf3ef",
          100: "#fae3d9",
          200: "#f4c3ac",
          300: "#ec9c78",
          400: "#e27249",
          500: "#c85a30",
          600: "#a04525",
          DEFAULT: "#e27249",
        },
        sage: {
          50:  "#f2f5f0",
          100: "#e1e9db",
          200: "#c1d2b6",
          300: "#99b58a",
          400: "#739963",
          500: "#567a47",
          600: "#426038",
          DEFAULT: "#739963",
        },
        // Neutrals
        puff: {
          white:  "#fdfcf9",
          light:  "#f5f1e8",
          muted:  "#8a7b6b",
          dark:   "#2c2218",
        },
      },
      fontFamily: {
        georgian: ['"Noto Sans Georgian"', "sans-serif"],
        sans: ['"Noto Sans Georgian"', '"Inter"', "sans-serif"],
        display: ['"Noto Serif Georgian"', '"Georgia"', "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft:    "0 2px 16px 0 rgba(44,34,24,0.07)",
        card:    "0 4px 24px 0 rgba(44,34,24,0.10)",
        lifted:  "0 8px 40px 0 rgba(44,34,24,0.14)",
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease-out",
        "slide-up":  "slideUp 0.4s ease-out",
        "skeleton":  "skeleton 1.5s ease-in-out infinite",
        "float":     "float 4s ease-in-out infinite",
        "fade-up":   "fadeUp 0.7s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        skeleton: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
