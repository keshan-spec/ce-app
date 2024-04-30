import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "theme-primary": "#b89855",
        "theme-primary-light": "#af9867e6",
        "theme-dark": "#0f0f0f",
        "theme-dark-100": "#474747",
      },
      height: {
        'inherit': 'inherit'
      }
    },
  },
  plugins: [],
};
export default config;
