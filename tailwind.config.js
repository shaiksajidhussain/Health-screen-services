/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2ff',
          100: '#fce7ff',
          200: '#f5d0fe',
          300: '#e9c4ff',
          400: '#d79bff',
          500: '#bb5cff',
          600: '#a13fff',
          700: '#8b2eff',
          800: '#6d1cd6',
          900: '#4c0f96',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

