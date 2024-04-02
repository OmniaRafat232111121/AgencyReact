
import React, { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { useDispatch } from 'react-redux'
import { logOut } from '../redux/lib/auth'
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
const Profile = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const NameUser = localStorage.getItem('NameUser');

  const handleLogOut = () => {
    Cookies.remove('user')
    dispatch(logOut({ isAuth: false, user: null }))
    navigate("/login")
  }
  const [isOpen, setIsOpen] = useState(false);


  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" onMouseEnter={handleToggle} onMouseLeave={handleClose}>
      <button
        className="relative flex max-w-xs items-center rounded-full
         bg-blue  p-3 text-sm focus:outline-none focus:ring-2
          focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
        onClick={handleToggle}
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>
        <BiUser size={18} className="h-6 w-6 rounded-full text-white" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right
         rounded-md bg-white py-1 shadow-lg ring-1
         ring-white ring-opacity-5 focus:outline-none">
          <a href="/account" className="block px-4 py-2 text-sm text-gray-700 font-bold">
            {NameUser}

          </a>
       
          <a href="#"
            className="block px-4 py-2 text-sm text-gray-700"
            onClick={handleLogOut}>
            Sign out
          </a>
        </div>
      )}
    </div>
  );
};

export default Profile;
