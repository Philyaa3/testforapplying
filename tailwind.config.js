/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '9-auto': 'repeat(9, max-content)',
      },
      colors: {
        black: '#212121',
        mainBlue: '#2490ED',
        subBlue: '#E1F1FF',
        mainGreen: '#257500',
        subGreen: '#E9FFE3',
        mainRed: '#CC1215',
        subRed: '#FFEBEB',
        headerGray: '#AAAAAA',
        actionGray: '#777777',
        rowBg: '#FCFCFE',
        textGray: '#666666',
      },
    },
  },
  plugins: [],
}