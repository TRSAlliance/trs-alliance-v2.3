/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include your component files
    "./public/index.html"         // Include your main HTML
  ],
  theme: {
    extend: {
      colors: {
        trs: {
          primary: "#5B21B6", // Example TRS purple
          secondary: "#06B6D4", // Cyan / accent
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
