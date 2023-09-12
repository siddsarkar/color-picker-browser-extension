/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./source/views/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5c6ac4',
        secondary: '#ecc94b'
      }
    }
  },
  darkMode: 'class',
  plugins: [require('@tailwindcss/forms')]
}
