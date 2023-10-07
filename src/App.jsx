import { I18nextProvider, useTranslation } from 'react-i18next';
import './App.css';
import About from './components/About';
import Blog from './components/Blog';
import Footer from './components/Footer';
import Home from './components/Home';
import Navbar from './components/Navbar';
import News from './components/News';
import Services from './components/Services';

function App() {
  const { i18n } = useTranslation();

  // const isRTL = i18n.language === 'ar';

  // if (isRTL) {
  //   import('../src/rtl.css'); // Adjust the path to your rtl.css file
  // } else {
  //   import('../src/ltr.css'); // Adjust the path to your ltr.css file
  // }

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>

    <I18nextProvider i18n={i18n}>
      <Navbar />
      <Home />
      <Services />
      <About />
      <Blog />
      <News />
      <Footer />
    </I18nextProvider>
    </div>
  );
}

export default App;
