import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.tsx",
    "./app/**/page.tsx",
    "./app/admin/page.tsx",
    "./app/learn/page.tsx",
    "./app/projectcomplete/page.tsx",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        "ptc-red": {
          100: "#ff424f",
          80: "#f8717b",
          60: "#ffaeb4",
        },
        "ptc-orange": {
          100: "#ff6830",
          80: "#ff8456",
          60: "#ffbfa7",
        },
        "ptc-yellow": {
          100: "#ff8b0f",
          80: "#ffa74a",
          60: "#ffd09d",
        },
        "ptc-green": {
          100: "#92af63",
          80: "#b1c78c",
          60: "#dbecbf",
        },
        "ptc-blue": {
          100: "#1b9cf7",
          80: "#7fc8fb",
          60: "#c7e6fc",
        },
        "ptc-purple": {
          100: "#7c72e8",
          80: "#9e97ed",
          60: "#bdb9e7",
        },
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            secondary: {
              DEFAULT: "#92af63",
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
        light: {
          colors: {
            secondary: {
              DEFAULT: "#92af63",
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
};
