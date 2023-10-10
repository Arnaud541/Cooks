/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        recipes: 'repeat(3,33.3%)'
      }
    },
    colors: {
      orange: '#E47915'
    }
  },
  plugins: [require("daisyui")],
}