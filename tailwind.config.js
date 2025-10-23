/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        secondary: '#F8F9FA',
        'gray-light': '#E9ECEF',
        'gray-medium': '#6C757D',
        'gray-dark': '#343A40',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      maxWidth: {
        'mobile': '430px',
      },
      height: {
        'screen-safe': 'calc(100vh - 80px)',
      },
    },
  },
  plugins: [],
}