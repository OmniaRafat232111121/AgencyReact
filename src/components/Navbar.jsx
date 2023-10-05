import { useState,useEffect } from "react";
import logo from '../assets/images/Icon.svg';
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
const Navbar = () => {
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
   <nav className={`py-4 lg:px-14 px-4 ${isMenuSticky? 'sticky top-0 left-0 right-0 border-b duration-400 bg-white ':''}`}>
   <div className="flex items-center justify-between  text-base gap-8">
    {/*log*/}
   <a className=" text-2xl font-semibold flex items-center space-x-3">
      <img src={logo} alt="logo" className="inline-flex align-center gap-0.5rem w-10"/>
      <span className="text-[#263238]"> Nexcent</span>
     </a>
     <ul className="md:flex space-x-12 hidden">
  {navItems.map((item, index) => (
    <li key={index}>
      <a href={item.path}  offset={-100} className="block
       text-base text-[#18191F] hover:text-green first:font-medium">
        {item.link}
      </a>
    </li>
  ))}
</ul>
{/*btn for large Devices*/}
<div className="lg:flex items-center space-x-12 hidden">
  <a className="text-[#4CAF4F] text-center hover:text-gray-900 cursor-pointer">Login</a>
  <button className="bg-green py-2 px-4 text-white transation-all duration-300 hover:bg-naturalGray cursor-pointer rounded">Sign up</button>
</div>

{/*menubtn for only devices mobile*/}
<div className="md:hidden">
  <button 
  onClick={toggleMenu}
  className="focus:outline-none focus:text-gray-600 text-naturalGray ">
    {isMenuOpen? (<AiOutlineClose className='h-6 w-6  '/>):(<AiOutlineMenu className="  h-6 w-6"/>)}
  </button>

</div>

   </div>

   {/*menu mobile*/}
   <div className={`bg-green mt-16 py-7 px-4 space-y-4 ${isMenuOpen ? 'block fixed top-0 left-0 right-0' : 'hidden'}`}>
  {navItems.map((item, index) => (
    <a key={index} href={item.path} offset={-100} className="block text-base text-[#18191F] hover:text-green first:font-medium">
      {item.link}
    </a>
  ))}
</div>

   </nav>

   </header>
  )
}

export default Navbar
