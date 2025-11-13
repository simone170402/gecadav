/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html",          // index global Angular
    "./src/app/**/*.{html,ts}",  // 🔥 toutes tes pages & tous tes composants (SITE + ADMIN)
    "./src/**/*.{html,ts}"       // par sécurité, si tu ajoutes d’autres dossiers dans src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
