/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          gray: "#161616",
          accent: "#ffffff", // Minimalist white accent
        }
      }
    },
  },
  plugins: [],
}