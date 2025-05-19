/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        burrito: {
          brown: "#703512",
          beige: "#FFE4B2",
          tomato: "#EF4444",
          guac: "#68B684",
          cheese: "#FFC93C",
          gray: "#E5DED6",
          burgundy: "#802418",
        },
        primary: {
          50: '#FFF9EF',
          100: '#FFE4B2', // Tortilla Beige
          200: '#FFDDA3',
          300: '#FFD694',
          400: '#FFCF85',
          500: '#FFC93C', // Cheese Yellow
          600: '#E8B836',
          700: '#D3A730',
          800: '#BE962A',
          900: '#A98524',
        },
        accent: {
          50: '#FDEEEE',
          100: '#FADCDC',
          200: '#F7CACA',
          300: '#F5B9B9',
          400: '#F2A7A7',
          500: '#EF4444', // Tomato Red
          600: '#D93E3E',
          700: '#C23838',
          800: '#AC3232',
          900: '#962C2C',
        },
        neutral: {
          50: '#F9F7F5', // Lighter Warm Gray
          100: '#F2EFEC',
          200: '#EBE7E3',
          300: '#E5DED6', // Warm Gray
          400: '#D0C9C1',
          500: '#B0A99F',
          600: '#90887E',
          700: '#70665C',
          800: '#50443A',
          900: '#703512', // Burrito Brown
        }
      },
      fontFamily: {
        sans: [
          'Nunito',
          'Poppins',
          'Quicksand',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        heading: [
          'Nunito',
          'Poppins',
          'Quicksand',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 10px 25px -3px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
