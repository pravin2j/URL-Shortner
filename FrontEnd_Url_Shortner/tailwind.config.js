/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        bluish: 'var(--bluish)',
        grayish: 'var(--grayish)',
        backgroundMain: 'var(--background-main)',
        fontColor: 'var(--font-color)',
      },
    },
  },
  plugins: [],
}

