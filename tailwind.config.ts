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
        "canvas-base": "#F8F6F0",
        "canvas-subtle": "#F4EFE6",
        "surface-card": "#FFFFFF",
        "content-primary": "#1A1A19",
        "content-secondary": "#7C7C74",
        "content-muted": "#9E9E96",
        "accent-olive": {
          DEFAULT: "#2C3328",
          hover: "#1E241B",
          subtle: "#4A5340",
        },
        "accent-gold": "#C5A880",
        "border-hairline": "rgba(197, 168, 128, 0.35)",
        "paper-border": "#E8E2D5",
        "notice-bg": "#F5EFEB",
        "notice-border": "#E2D9CC",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 20px 50px rgba(0, 0, 0, 0.06)",
        "editorial-lg": "0 25px 60px rgba(44, 51, 40, 0.08)",
        "editorial-sm": "0 4px 20px rgba(0, 0, 0, 0.03)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
