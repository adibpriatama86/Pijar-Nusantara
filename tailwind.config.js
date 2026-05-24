/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunset: {
          DEFAULT: '#FF7A59',
          light: '#FF9478',
          dark: '#E05F3E',
        },
        mint: {
          DEFAULT: '#A8E6CF',
          light: '#C3F0DC',
          dark: '#7CD1B2',
        },
        accentSky: {
          DEFAULT: '#DCEDC1',
          light: '#EAF6DD',
          dark: '#B8CFA0',
        },
        darkslate: {
          DEFAULT: '#33415C',
          light: '#4E5E7A',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
