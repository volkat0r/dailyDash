/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dash: {
          bg:      '#0f1117',
          surface: '#1a1d2e',
          card:    '#1e2235',
          border:  '#2a2f47',
          text:    '#e2e8f0',
          muted:   '#8892b0',
          pink:    '#e040fb',
          purple:  '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
