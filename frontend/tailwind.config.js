/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aviaIvory: '#FFF9F5',
        aviaPeachSoft: '#FCE1D2',
        aviaPeachLight: '#FBEDE5',
        aviaCoral: '#FF7055',
        aviaCoralDeep: '#E85D43',
        aviaCharcoal: '#302522',
        aviaMuted: '#6F625D',
        aviaWhite: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.15' },
          '50%': { transform: 'scale(1.1)', opacity: '0.25' },
        }
      },
      animation: {
        pulseSlow: 'pulseSlow 18s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}
