/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        husk: {
          950: "#14110D",
          900: "#1B1712",
          800: "#241F18",
          700: "#332B20",
          600: "#4A4032",
          500: "#6B5E4B",
          400: "#8F8064",
          300: "#A69C8D",
          100: "#E9E2D6",
          50: "#F5F0E6",
        },
        gold: {
          400: "#E4BC6B",
          500: "#D6A94B",
          600: "#B78C34",
        },
        wine: {
          400: "#C1584F",
          500: "#A63D40",
          600: "#832F31",
        },
        sage: {
          400: "#96C0A3",
          500: "#7BA88A",
          600: "#5E8A6E",
          900: "#1B2A20",
          800: "#22331F"
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 12px 32px -12px rgba(0,0,0,0.55)",
      },
      backgroundImage: {
        "after-card":
          "radial-gradient(120% 140% at 0% 0%, #2C3B29 0%, #1E2A1B 55%, #171A14 100%)",
        "before-card":
          "radial-gradient(120% 140% at 0% 0%, #2A241C 0%, #1F1A14 55%, #17130F 100%)",
      },
    },
  },
  plugins: [],
};
