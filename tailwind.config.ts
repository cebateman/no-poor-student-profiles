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
        // No Poor Africa brand colors
        npa: {
          green: {
            DEFAULT: "#2D6A4F",
            light: "#40916C",
            lighter: "#52B788",
            dark: "#1B4332",
          },
          cream: "#FAFAF8",
          warmWhite: "#FFF8F0",
          accent: "#D4A373",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
