import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '640px',      // Mobile landscape
      'md': '768px',      // Tablet
      'lg': '1024px',     // Tablet landscape / Small laptop
      'hd': '1280px',     // 720p / HD Ready starts
      'fhd': '1920px',    // Full HD (1080p)
      'qhd': '2560px',    // 2K / QHD
      'uhd': '3840px',    // 4K / UHD
    },
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)'],
        'google-sans': ['var(--font-google-sans)'],
        'google-sans-flex': ['var(--font-google-sans-flex)'],
        questrial: ['var(--font-questrial)'],
        roboto: ['var(--font-roboto)'],
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
