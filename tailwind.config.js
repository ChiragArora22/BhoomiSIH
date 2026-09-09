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
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        soft: '0 4px 24px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
      },
      colors: {
        // Brand Primary (Indigo/Blue-Violet) - dedicated for CTAs, active states, focus rings
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Main Primary CTA
          700: '#4338CA', // Primary Hover
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
          DEFAULT: '#4F46E5',
        },
        // Semantic Surfaces via CSS variables
        surface: {
          base: 'var(--bg-base)',
          card: 'var(--bg-surface)',
          raised: 'var(--bg-surface-raised)',
          border: 'var(--border-subtle)',
          'border-strong': 'var(--border-strong)',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', '"Noto Sans Devanagari"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
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
