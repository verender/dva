/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Dosis"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FAF3E6",
        ivory: "#FFFDF8",
        gold: "#C9A24B",
        amber: {
          soft: "#E8B978",
        },
        madrid: "#5E3A9E",
      },
      animation: {
        "fade-in": "fadeIn 1.6s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
