/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'], // Certifique-se de usar o nome exato da fonte
      },
      colors: {
        // primary: "#f5f6f2",
        primary: "#f9f9f9",
        primaryLight: "#e3f7fa",
        secondary: "#00801A",
        wood: "#52301A",
        tertiary: "#404040",
        socialFa: "#0861F2",
        socialIns: "#E31F47",
        gray: {
          10: "#EEEEEE",
          20: "#A2A2A2",
          30: "#7B7B7B",
          50: "#585858",
          90: "#141414",
        },
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
        sm500: "500px",
        sm600: "600px",
      },
      backgroundImage: {
        hero: "url(/src/assets/bg.png)",
        banner: "url(/src/assets/banner.png)",
        aboutImage: "url(/src/assets/imgAbout/floresta.webp)",
        aboutImage2: "url(/src/assets/imgAbout/madeira1.jpg)",
        aboutImage3: "url(/src/assets/imgAbout/madeira2.jpg)",
        aboutImage4: "url(/src/assets/imgAbout/madeira3.jpg)",
      },
    },
  },
  plugins: [],
}