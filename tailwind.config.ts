import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sensory: {
          blue: {
            50: "#f0f7ff",
            100: "#e0effe",
            200: "#bae0fd",
            300: "#7cc5fb",
            400: "#38a5f6",
            500: "#0f88eb",
            600: "#026ac9",
            700: "#0354a2",
            800: "#074785",
            900: "#0c3b6e",
          },
          sand: {
            50: "#fdfbf7",
            100: "#f8f4ec",
            200: "#f0e6d6",
            300: "#e3d2b7",
            400: "#d3b993",
            500: "#c4a174",
            600: "#b0895c",
            700: "#936f4a",
            800: "#77593f",
            900: "#624a36",
          },
          forest: {
            50: "#f2f8f5",
            100: "#e1efe8",
            200: "#c4e0d3",
            300: "#9bc8b7",
            400: "#6da996",
            500: "#4f8d7b",
            600: "#3c7062",
            700: "#325a50",
            800: "#2b4941",
            900: "#263e38",
          },
          lavender: {
            50: "#faf8ff",
            100: "#f2edff",
            200: "#e7ddff",
            300: "#d4c1ff",
            400: "#b897fe",
            500: "#9c6bf9",
            600: "#8645ed",
            700: "#7432d6",
            800: "#612aaec",
            900: "#50248e",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-lexend)", "system-ui", "sans-serif"],
      },
      animation: {
        'breathe-in-out': 'breathe 16s ease-in-out infinite',
        'gentle-pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soft-float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '25%': { transform: 'scale(1.28)', opacity: '1' }, // Inhale 4s
          '50%': { transform: 'scale(1.28)', opacity: '1' }, // Hold 4s
          '75%': { transform: 'scale(1)', opacity: '0.85' },  // Exhale 4s
          '87.5%': { transform: 'scale(1)', opacity: '0.85' },// Hold 2s
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
