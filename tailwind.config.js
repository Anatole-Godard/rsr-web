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
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
    },
    variants: {
      extend: {},
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
