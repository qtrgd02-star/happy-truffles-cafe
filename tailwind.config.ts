import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: "#3E2723",
        vanilla: "#FFF8E1",
        truffle: "#D4AF37",
        matcha: "#A8C69F",
        warmWhite: "#FAFAFA",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
