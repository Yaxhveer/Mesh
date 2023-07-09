/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sr': '560px',
        'ss': '480px',
        'xs': '360px',
      }, colors: {
        'my-blue': '#0093e9',
        'my-green': '#80d0c7',
        'my-dark-blue': '#012f4a',
        'my-dark-green': '#04b0b0'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  darkMode: 'class',
}

