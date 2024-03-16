/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5c6ac4',
        secondary: '#ecc94b',
        background: {
          light: '#eceff7',
          dark: '#282828',
          DEFAULT: '#fff'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
