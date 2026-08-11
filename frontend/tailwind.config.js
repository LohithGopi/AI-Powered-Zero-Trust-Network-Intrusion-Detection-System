/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1769E0',
          navy: '#0F3B68',
          bg: '#F5F7FA',
          card: '#FFFFFF',
          dark: '#172033',
          slate: '#475569',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(23, 105, 224, 0.1), 0 8px 10px -6px rgba(23, 105, 224, 0.05)',
        'hero': '0 20px 40px -15px rgba(15, 59, 104, 0.08)'
      }
    },
  },
  plugins: [],
}
