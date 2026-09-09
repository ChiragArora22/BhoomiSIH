/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 12px 40px -18px rgb(80 40 16 / 0.28)',
      },
      colors: {
        // Warm espresso (replaces cool slate in the UI)
        slate: {
          50: '#FBF6EE',
          100: '#F6EBDC',
          200: '#EAD6BB',
          300: '#D4B894',
          400: '#B08A62',
          500: '#8C6A48',
          600: '#6E5238',
          700: '#4F3C2C',
          800: '#3A2C20',
          900: '#241910',
          950: '#16100C',
        },
        // Terracotta (replaces mint emerald)
        emerald: {
          50: '#FDF4EC',
          100: '#F8E0D4',
          200: '#F0C4A8',
          300: '#E39A70',
          400: '#D47845',
          500: '#C45C26',
          600: '#A84B1E',
          700: '#8A3C18',
          800: '#6B2E14',
          900: '#4A2010',
          950: '#2C140A',
        },
        sih: {
          50: '#FDF4EC',
          100: '#F8E0D4',
          200: '#F0C4A8',
          300: '#E39A70',
          400: '#D47845',
          500: '#C45C26',
          600: '#A84B1E',
          700: '#8A3C18',
          800: '#6B2E14',
          900: '#4A2010',
        },
        navy: {
          800: '#3A2C20',
          850: '#241910',
          900: '#16100C',
          950: '#100C0A',
        },
        gold: {
          400: '#E8B84A',
          500: '#D4A017',
          600: '#B8860B',
        },
        cream: {
          50: '#FFFBF5',
          100: '#F6EDE0',
          200: '#EBD9C4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'Mangal', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
