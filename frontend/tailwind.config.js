/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'near-black': '#0b0b0b',
        'dark-pink': '#c2185b',
        'text-primary': '#ffffff',
        'text-secondary': '#bdbdbd',
      },
      backgroundColor: {
        'near-black': '#0b0b0b',
        'dark-pink': '#c2185b',
      },
      textColor: {
        'primary': '#ffffff',
        'secondary': '#bdbdbd',
      }
    },
  },
  plugins: [],
}

