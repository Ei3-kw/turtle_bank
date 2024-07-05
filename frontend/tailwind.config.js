const { theme } = require('./src/styles/theme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: theme.colors,
      fontSize: theme.fontSizes,
      spacing: theme.spacing,
    },
  },
  plugins: [],
}