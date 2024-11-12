/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "tryon-primary": "var(--tryon-primary)",
        "tryon-secondary": "var(--tryon-secondary)",
        red: "#ff0000",
      },
      fontFamily: {
        metropolis: ["Metropolis", "sans-serif"],
      },
      colors: {
        "tryon-black": "rgba(255, 255, 255, 0.20)",

        "tryon-secondary": "#404040",
      },
    },
  },
  plugins: [],
};
