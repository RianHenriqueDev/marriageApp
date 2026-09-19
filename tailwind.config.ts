import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fbf8ee",
          100: "#f6eed9",
          200: "#eddcb3",
          300: "#e2c488",
          400: "#d7aa5f",
          500: "#c79038",
          600: "#ab732c",
          700: "#895525",
          800: "#714524",
          900: "#5f3b23",
        },
        champagne: {
          50: "#faf8f5",
          100: "#f5f0e9",
          200: "#ede2d4",
          300: "#dfcdb6",
          400: "#ccb091",
          500: "#b89673",
          600: "#a38060",
          700: "#83654e",
          800: "#6c5343",
          900: "#594539",
        },
        emeraldDeep: "#0a261f",
        forestGold: "#133e33",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        pixel: ["var(--font-pixel)", "monospace"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
