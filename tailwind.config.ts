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
            DEFAULT: "#335D63",
            light: "#4A7A80",
            lighter: "#6A9A9F",
            dark: "#1E3A3F",
          },
          cream: "#CEDBD5",
          warmWhite: "#E3EBE6",
          accent: "#F1CB4B",
          dark: "#271609",
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
