module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: {
      marianne: ['"Marianne"', "serif"],
      spectral: ['"Spectral"', "serif"],
    },
    extend: {
      colors: {
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
    plugins: [require("@tailwindcss/typography")],
  },
};
