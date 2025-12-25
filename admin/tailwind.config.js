/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3f6ad8", // Màu xanh đặc trưng của ArchitectUI
        secondary: "#6c757d",
        sidebar: "#343a40",
      }
    },
  },
  plugins: [],
}