/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  prefix:'tw-',
  content: [
    "./src/**/*.{html,ts}",
    "./src/app/ModulosSistema/RiesgoCredito/Mantenimientos/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

