/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0d12",
          900: "#11141c",
          850: "#161a24",
          800: "#1c212d",
          700: "#262c3a",
          600: "#3a4254",
        },
        accent: {
          400: "#7dd3fc",
          500: "#38bdf8",
          600: "#0ea5e9",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 80%, 100%": { opacity: "0.25" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out both",
        blink: "blink 1.2s infinite",
      },
    },
  },
  plugins: [],
};
