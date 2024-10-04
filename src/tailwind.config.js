/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/index.ejs", "./public/css/*.css", "./node_modules/tw-elements/js/**/*.js"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [require("tw-elements/plugin.cjs")],
}




