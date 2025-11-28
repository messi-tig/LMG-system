/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode toggling
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Tailwind blue-500
          light: '#60a5fa',
          dark: '#2563eb',
        },
        secondary: {
          DEFAULT: '#f97316', // Tailwind orange-500
        },
      },
      boxShadow: {
        card: '0 20px 40px rgba(0, 0, 0, 0.1)',
        cardHover: '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
