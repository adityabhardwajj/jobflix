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
      colors: {
        // Semantic color tokens mapped to CSS variables
        'bg': 'hsl(var(--bg))',
        'fg': 'hsl(var(--fg))',
        'card': 'hsl(var(--card))',
        'card-fg': 'hsl(var(--card-fg))',
        'muted': 'hsl(var(--muted))',
        'muted-fg': 'hsl(var(--muted-fg))',
        'accent': 'hsl(var(--accent))',
        'accent-fg': 'hsl(var(--accent-fg))',
        'primary': 'hsl(var(--primary))',
        'primary-fg': 'hsl(var(--primary-fg))',
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        blob: 'blob 7s infinite',
        'typing-bounce': 'typing-bounce 1s infinite',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
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
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          }
        },
        glow: {
          '0%': {
            'box-shadow': '0 0 5px #00E5FF, 0 0 10px #00E5FF, 0 0 15px #00E5FF'
          },
          '100%': {
            'box-shadow': '0 0 10px #00E5FF, 0 0 20px #00E5FF, 0 0 30px #00E5FF'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
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
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#262626",
            primary: {
              DEFAULT: "#3B82F6",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#737373",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#10B981",
              foreground: "#FFFFFF",
            },
            focus: "#3B82F6",
            content1: "#FFFFFF",
            content2: "#F5F5F5",
            content3: "#E4E4E4",
            content4: "#D4D4D4",
          },
        },
        dark: {
          colors: {
            background: "#121212",
            foreground: "#E5E7EB",
            primary: {
              DEFAULT: "#22D3EE",
              foreground: "#121212",
            },
            secondary: {
              DEFAULT: "#999999",
              foreground: "#121212",
            },
            success: {
              DEFAULT: "#10B981",
              foreground: "#FFFFFF",
            },
            focus: "#22D3EE",
            content1: "#171717",
            content2: "#262626",
            content3: "#333333",
            content4: "#404040",
          },
        },
      },
    }),
  ],
} 