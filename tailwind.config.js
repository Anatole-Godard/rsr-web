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
          50: "#7878FF",
          100: "#5E5EFF",
          200: "#2B2BFF",
          300: "#0000F7",
          400: "#0000C4",
          500: "#000091",
          600: "#00005E",
          700: "#00002B",
          800: "#000000",
          900: "#000000",
        },
        rougeMarianne: {
          DEFAULT: "#E1000F",
          50: "#FFC8CB",
          100: "#FFAEB3",
          200: "#FF7B84",
          300: "#FF4854",
          400: "#FF1525",
          500: "#E1000F",
          600: "#AE000C",
          700: "#7B0008",
          800: "#480005",
          900: "#150001",
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
};
