import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        blob: 'blob 7s infinite',
        'typing-bounce': 'typing-bounce 1s infinite',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards'
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)'
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)'
          }
        },
        'typing-bounce': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        fadeIn: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        slideUp: {
          '0%': {
            transform: 'translateY(1rem)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      }
    }
  },
  darkMode: "class",
  plugins: [
    require("tailwindcss-animate"),
    heroui({
      themes: {
        "jobflix-light": {
          extend: "light",
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#e6f1fe",
              100: "#cce3fd",
              200: "#99c7fb",
              300: "#66aaf9",
              400: "#338ef7",
              500: "#006FEE",
              600: "#005bc4",
              700: "#004493",
              800: "#002e62",
              900: "#001731",
              DEFAULT: "#006FEE",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#f2f2f3",
              100: "#e6e6e6",
              200: "#cccccd",
              300: "#b3b3b4",
              400: "#99999b",
              500: "#808082",
              600: "#666668",
              700: "#4d4d4f",
              800: "#333335",
              900: "#1a1a1c",
              DEFAULT: "#808082",
              foreground: "#ffffff",
            },
            default: {
              50: "#fafafa",
              100: "#f4f4f5",
              200: "#e4e4e7",
              300: "#d4d4d8",
              400: "#a1a1aa",
              500: "#71717a",
              600: "#52525b",
              700: "#3f3f46",
              800: "#27272a",
              900: "#18181b",
              DEFAULT: "#d4d4d8",
              foreground: "#11181C",
            },
            content1: "#FFFFFF",
            content2: "#f7f7f9",
            content3: "#eeeef0",
            content4: "#e6e6e8",
          },
        },
        "jobflix-dark": {
          extend: "dark",
          colors: {
            background: "#0D1117",
            foreground: "#ECEDEE",
            primary: {
              50: "#001731",
              100: "#002e62",
              200: "#004493",
              300: "#005bc4",
              400: "#006FEE",
              500: "#338ef7",
              600: "#66aaf9",
              700: "#99c7fb",
              800: "#cce3fd",
              900: "#e6f1fe",
              DEFAULT: "#006FEE",
              foreground: "#ffffff",
            },
            secondary: {
              50: "#1a1a1c",
              100: "#333335",
              200: "#4d4d4f",
              300: "#666668",
              400: "#808082",
              500: "#99999b",
              600: "#b3b3b4",
              700: "#cccccd",
              800: "#e6e6e6",
              900: "#f2f2f3",
              DEFAULT: "#808082",
              foreground: "#ffffff",
            },
            default: {
              50: "#18181b",
              100: "#27272a",
              200: "#3f3f46",
              300: "#52525b",
              400: "#71717a",
              500: "#a1a1aa",
              600: "#d4d4d8",
              700: "#e4e4e7",
              800: "#f4f4f5",
              900: "#fafafa",
              DEFAULT: "#3f3f46",
              foreground: "#ECEDEE",
            },
            content1: "#18181b",
            content2: "#27272a",
            content3: "#3f3f46",
            content4: "#52525b",
          },
        },
      },
    }),
  ],
} 