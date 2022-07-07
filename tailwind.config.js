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
          50: "#f0f8ff",
          100: "#d9d9f0",
          200: "#b2b2e0",
          300: "#8585c9",
          400: "#5c5ca9",
          500: "#000091",
          600: "#00006f",
          700: "#00004d",
          800: "#00002b",
          900: "#000011",
        },
        rougeMarianne: {
          DEFAULT: "#E1000F",
          50: "#FF9AA0",
          100: "#FF858D",
          200: "#FF5C67",
          300: "#FF3441",
          400: "#FF0B1B",
          500: "#E1000F",
          600: "#A9000B",
          700: "#710008",
          800: "#390004",
          900: "#010000",
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
      animation: {
        stories: "stories 10s linear"
      },

      keyframes: {
        stories: {
          "0%": {
           width: "0%"
          },
          "100%": {
            width: "100%"
          },
        },
      },
    },
    variants: {
      extend: {},
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
