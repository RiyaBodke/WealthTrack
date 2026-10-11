/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary : "rgba(30, 41, 59, 1)",
        white : "#F8FAFC",
        chart : "#FFFFFF",
        background : "oklch(62.3% 0.214 259.815)",
        blue: {
          back: "rgba(140, 183, 255, 0.43)",
          text: "rgba(34, 118, 255, 0.94)",
          progressBar: "rgba(161, 194, 248, 0.58)",
          box: "oklch(80.9% 0.105 251.813)",
        },
        green:{
          profile: "rgba(16, 185, 129, 0.30)",
          text: "rgba(0, 167, 117, 1)",
        },
        gray: "oklch(44.6% 0.043 257.281)",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #DFE7F6 0%, #C1DCFE 100%)',
        'custom-gradient-green': 'linear-gradient(135deg, #16B1A2 0%, #009590 100%)',
      },
      fontSize:{
        xxs: "10px",
        xxxs: "8px",
        xxxxs: "6px",
      },
    },
  },
  plugins: [],
}

