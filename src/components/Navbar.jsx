import { useState,useEffect } from "react";
import logo from '../assets/images/Icon.svg';
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
const Navbar = () => {
  const { t } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const isRTL = i18n.language === 'ar';


  const navItems=[
    {link:'Home',path:'home'},
    {link:'Services',path:'services'},
    {link:'About',path:'about'},
    {link:'Product',path:'product'},
    {link:'Testimonials',path:'testimonials'},
    {link:'FAQ',path:'faq'},
  ]
  const [isMenuSticky,setIsMenuSticky]=useState(false);
  const [isMenuOpen,setIsMenuOpen]=useState(false);
  const toggleMenu=()=>{
    setIsMenuOpen(!isMenuOpen)
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsMenuSticky(true);
      } else {
        setIsMenuSticky(false);
      }
    };
  
    // Add the event listener
    window.addEventListener("scroll", handleScroll);
  
    // Remove the event listener in the cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Add an empty dependency array to run this effect only once
  
 
  return (
    <header className="bg-white md:bg-transparent w-full fixed top-0 left-0 right-0">
    <nav className={`py-4 lg:px-14 px-4 ${isMenuSticky ? 'sticky top-0 left-0 right-0 border-b duration-400 bg-white ' : ''}`}>
      <div className="flex items-center justify-between  text-base gap-8">
        {/* Logo */}
        <a className="text-2xl font-semibold flex items-center space-x-3">
          <img src={logo} alt="logo" className="inline-flex align-center gap-0.5rem w-10" />
          <span className="text-[#263238]"> Nexcent</span>
        </a>

       

        <ul className="md:flex space-x-12 hidden">
          {navItems.map((item, index) => (
            <li key={index}>
              <a href={item.path} offset={-100} className={`block text-base text-[#18191F]
               hover:text-green first:font-medium ${isRTL ?'mr-5':''}`}>
                {t(item.link)}
              </a>
            </li>
          ))}
        </ul>

        {/* Buttons for large Devices */}
        <div className={`lg:flex items-center space-x-12 hidden ${isRTL? 'gap-x-6':''}` }>
          <a className="text-[#4CAF4F] text-center hover:text-gray-900 cursor-pointer">
            {t('login')}</a>
            <button
        className={`bg-green py-2 px-4 text-white transition-all duration-300
         hover:bg-naturalGray cursor-pointer rounded ${
          isRTL ? 'rtl' : 'ltr'
        }`}
      >
        {t('signup')}
      </button>
        </div>


        <div className="flex items-center justify-between text-base gap-8">
  {/* ... */}
  <div>
    <button
      onClick={() => changeLanguage("en")}
      className={`px-2 py-1 rounded cursor-pointer  ${
        i18n.language === "en" ? "bg-green text-white" : "text-green bg-white"
      }`}
    >
      English
    </button>
    <button
      onClick={() => changeLanguage("ar")}
      className={`px-2 py-1 rounded cursor-pointer   ${
        i18n.language === "ar" ? "bg-green text-white " : "text-green bg-white"
      }`}
    >
      العربية
    </button>
  </div>
</div>

        {/* Menu button for mobile devices */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none focus:text-gray-600 text-naturalGray "
          >
            {isMenuOpen ? (<AiOutlineClose className='h-6 w-6  ' />) : (<AiOutlineMenu className="  h-6 w-6" />)}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`bg-green mt-16 py-7 px-4 space-y-4 
      ${isMenuOpen ? 'block fixed top-0 left-0 right-0' : 'hidden'}`}>
        {navItems.map((item, index) => (
          <a key={index} href={item.path} 
          offset={-100} className={`block text-base text-[#18191F] hover:text-green first:font-medium `}>
            {t(item.link)}
          </a>
        ))}
      </div>
    </nav>
  </header>
  )
}

export default Navbar
