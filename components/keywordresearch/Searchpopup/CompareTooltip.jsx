import React, { useState } from 'react';
import ComparePopUp from './ComparePopUp';
import { MdCompareArrows } from "react-icons/md";

const CompareTooltip = () => {
    const [isCompareModalVisible, setIsCompareModalVisible] = useState(false); // State for showing/hiding compare modal
    const handleCompareClick = () => {
      setIsCompareModalVisible(true);
    };
  return (
    <div>
                        <div>
      <div className="fixed  z-[1000]">
        <MdCompareArrows
          className="text-2xl bg-blue text-white rounded-full p-2 
          fixed bottom-[100px] right-[20px] hover:bg-white hover:text-blue
           hover:border-2 hover:border-blue hover:transition ease-in-out delay-30 mt-[100px] cursor-pointer z-[100]"
          size={50}

          onClick={handleCompareClick}
        
        />
      </div>
      <ComparePopUp 
        isVisible={isCompareModalVisible} 
        onClose={() => setIsCompareModalVisible(false)} 
      />

     
    </div>
    </div>
  )
}

export default CompareTooltip