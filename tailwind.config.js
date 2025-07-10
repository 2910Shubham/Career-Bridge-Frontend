/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5A827E',
        secondary: '#84AE92',
        accent: '#B9D4AA',
        textDark: '#333333',
        background: '#FFFFFF',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  }
} 