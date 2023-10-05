export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'

  ],
  theme: {
    extend: {
      colors:{
        green:'#4CAF4F',
        black:'#18191F',
        naturalGray:'#4D4D4D',
        whiteBlue:'#F5F7FA'
      }
    },
  },
 
    // eslint-disable-next-line no-undef
    plugins: [require('flowbite/plugin')],


}