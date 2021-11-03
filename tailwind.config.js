const colors = require("tailwindcss/colors");
delete colors.lightBlue;

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      marianne: ['"Marianne"', "serif"],
    },
    extend: {
      colors: {
        ...colors,
        bleuFrance: {
          DEFAULT: "#000091",
          500: "#000091",
        },
        rougeMarianne: {
          DEFAULT: "#E1000F",
          500: "#E1000F",
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
};
