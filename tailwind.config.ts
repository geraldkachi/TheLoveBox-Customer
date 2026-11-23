import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // All colours come from app/theme.css — edit that file, not this one.
        ink: { DEFAULT: "rgb(var(--ink) / <alpha-value>)", soft: "rgb(var(--ink-soft) / <alpha-value>)", muted: "rgb(var(--ink-muted) / <alpha-value>)" },
        primary: { 50: "rgb(var(--primary-50) / <alpha-value>)", 100: "rgb(var(--primary-100) / <alpha-value>)", 200: "rgb(var(--primary-200) / <alpha-value>)", 300: "rgb(var(--primary-300) / <alpha-value>)", 400: "rgb(var(--primary-400) / <alpha-value>)", 500: "rgb(var(--primary-500) / <alpha-value>)", 600: "rgb(var(--primary-600) / <alpha-value>)", 700: "rgb(var(--primary-700) / <alpha-value>)", 800: "rgb(var(--primary-800) / <alpha-value>)", 900: "rgb(var(--primary-900) / <alpha-value>)" },
        gold: { 50: "rgb(var(--gold-50) / <alpha-value>)", 100: "rgb(var(--gold-100) / <alpha-value>)", 200: "rgb(var(--gold-200) / <alpha-value>)", 300: "rgb(var(--gold-300) / <alpha-value>)", 400: "rgb(var(--gold-400) / <alpha-value>)", 500: "rgb(var(--gold-500) / <alpha-value>)", 600: "rgb(var(--gold-600) / <alpha-value>)" },
        cream: { 50: "rgb(var(--cream-50) / <alpha-value>)", 100: "rgb(var(--cream-100) / <alpha-value>)", 200: "rgb(var(--cream-200) / <alpha-value>)", 300: "rgb(var(--cream-300) / <alpha-value>)" },
        line: "rgb(var(--line) / <alpha-value>)",
        leaf: "rgb(var(--leaf) / <alpha-value>)",
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
        lift: "0 18px 40px -18px rgb(var(--primary-700) / 0.28)",
        float: "0 30px 60px -25px rgba(30, 22, 27, 0.35)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
} satisfies Config;
