/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./**/*.{html,ts}", // <-- ajoute cette ligne
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
