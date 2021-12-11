const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.slate,
        secondary: colors.fuchsia,
        accent: colors.cyan,
      },
      fontFamily: {
        sans: ["Outfit", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
