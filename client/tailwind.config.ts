import { ColorScale, heroui, colors } from "@heroui/react";
import type { Config } from "tailwindcss";

const teal = {
  50: "#ecfdf5",
  100: "#d0fae5",
  200: "#a4f4cf",
  300: "#5ee9b5",
  400: "#00d492",
  500: "#00bc7d",
  600: "#009966",
  700: "#007a55",
  800: "#006045",
  900: "#004f3b",
  // 950: "#002c22",
} satisfies ColorScale;

export default {
  content: ["./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            foreground: "#11181C",
            primary: {
              ...teal,
              foreground: "#FFFFFF",
              DEFAULT: teal[600],
            },
          },
        },
        dark: {
          colors: {
            background: "#11181C",
            foreground: "#ECEDEE",
            primary: {
              ...teal,
              foreground: "#FFFFFF",
              DEFAULT: teal[600],
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
