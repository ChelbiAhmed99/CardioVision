/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        cardio: {
          dark: '#07090f',
          darker: '#040508',
          accent: '#2563eb',
          primary: '#3b82f6',
          secondary: '#06b6d4',
          950: '#0a0a0f',
          900: '#13131a',
        }
      },
      animation: {
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'dash': 'dash 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        dash: {
          '100%': { strokeDashoffset: '-200' },
        }
      }
    },
  },
  plugins: [],
};