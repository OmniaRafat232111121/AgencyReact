import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaPlus } from 'react-icons/fa'; // Importing an icon
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { MdCompareArrows } from "react-icons/md";

const Query = ({ hasKeywordData, hasUrlData }) => {
  const navigate = useNavigate();

  const containerClasses = `mx-auto absolute bg-white h-screen transition-all mt-[4rem] inset-0 duration-300 ease-in-out ${
    hasKeywordData || hasUrlData ? "z-10" : "z-[-10]"
  }`;

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
 


  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const location = useLocation();
  const { urlData, keywordData } = location.state || {};

  const openPopup = () => {
     navigate("/searching")
  
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    if (!keywordData) {
      navigate(-1);
    }
  };

  

  return (
    <div className={`mx-auto  bg-white
      transition-all mt-[4rem] 
      inset-0 duration-300 ease-in-out z-[100]`}> 
      <div
        className="tooltip-container cursor-pointer mt-[200px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openPopup}
      >
        <FaPlus
          className="text-2xl bg-blue  text-white rounded-full p-2 
          fixed bottom-[30px] right-[20px] hover:bg-white hover:text-blue hover:border-2 hover:border-blue hover:transition ease-in-out delay-30 mt-[100px] cursor-pointer"
          size={50}
        />
      
      </div>


    </div>
  );
};

export default Query;
