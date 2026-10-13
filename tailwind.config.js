export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        farmer: { DEFAULT: "#16a34a", light: "#dcfce7", dark: "#14532d" },
        student: { DEFAULT: "#dc2626", light: "#fee2e2", dark: "#7f1d1d" }
      }
    }
  },
  plugins: []
};
