/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './layouts/**/*.{js,ts,jsx,tsx}',
      ],
    theme: {
      extend: {
        colors: {
          primary: "#0F172A",
          accent: "#38BDF8",
          // Add any FAS branding colors here
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"],
          // Or whatever your FAS font setup is
        },
      },
    },
    plugins: [],
  };
