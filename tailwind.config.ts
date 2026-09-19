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
        "canvas-base": "#FDFBF7",
        "canvas-subtle": "#F4EFE6",
        "surface-card": "#FFFFFF",
        "content-primary": "#1A1A19",
        "content-secondary": "#5A5A55",
        "content-muted": "#8C8C84",
        "accent-olive": {
          DEFAULT: "#4A5340",
          hover: "#3B4233",
        },
        "accent-gold": "#C5A880",
        "border-hairline": "rgba(74, 83, 64, 0.12)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 8px 30px rgba(0, 0, 0, 0.04)",
        "editorial-lg": "0 14px 40px rgba(74, 83, 64, 0.06)",
        "editorial-sm": "0 2px 10px rgba(0, 0, 0, 0.03)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
