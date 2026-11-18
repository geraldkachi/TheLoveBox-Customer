import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1E161B", soft: "#4A3D45", muted: "#7A6B74" },
        ribbon: { 300: "#FEA6DC", 400: "#FD66C3", 500: "#EC45AD", 600: "#D4258F", 700: "#A9186F" },
        petal: { 50: "#FFF8FC", 100: "#FBEAF3", 200: "#F5D6E6", 300: "#EDBFD7" },
        line: "#EFE2EA",
        leaf: "#2F8F5B",
        // legacy aliases so any untouched class keeps working
        brand: { pink: "#D4258F", pinkDark: "#A9186F", blush: "#FBEAF3", cream: "#FFF8FC", ink: "#1E161B", gold: "#D4258F" },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque Variable", "Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque Variable", "Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        script: ['"Mrs Saint Delafield"', "cursive"],
      },
      fontSize: {
        // ~1.25 modular scale
        "2xs": ["0.75rem", { lineHeight: "1.1rem" }],
        display: ["clamp(2.6rem, 6vw, 4.6rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        h1: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h2: ["clamp(1.6rem, 3vw, 2.2rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      boxShadow: {
        lift: "0 18px 40px -18px rgba(120, 20, 80, 0.28)",
        float: "0 30px 60px -25px rgba(30, 22, 27, 0.35)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
} satisfies Config;
