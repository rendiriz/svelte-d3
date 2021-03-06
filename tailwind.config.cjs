module.exports = {
  purge: {
    enabled: true,
    content: [
      './public/index.html',
      './src/**/*.svelte'
    ],
    options: {
      defaultExtractor: content => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['"Roboto"'],
      'lora': ['"Lora"'],
      'lato': ['"Lato"'],
      'roboto': ['"Roboto"'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
