/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#d05ddd",

          "secondary": "#bbdbf9",

          "accent": "#d0e884",

          "neutral": "#302a3c",

          "base-100": "#eae8ed",

          "info": "#a1cff2",

          "success": "#0f7646",

          "warning": "#f6c36a",

          "error": "#f58470",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}

