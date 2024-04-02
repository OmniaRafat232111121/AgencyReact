
import React from 'react';
import MultiStepForm from '../components/keyword/MultiStepForm';
import { useNavigate } from 'react-router-dom';

const ComparePopUp = ({ onClose, isVisible }) => {
  const navigate = useNavigate();

  // Handle form submission
  const handleFormSubmit = (data) => {
    // Process form data, then navigate or close popup
    console.log(data); // Example action
    navigate('/comparepage', { state: { /* Your state based on form data */ } });
    onClose(); // Close the popup after form submission
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-25">
      <div className="bg-white rounded-lg shadow-xl p-[40px] m-4 max-w-md w-full">
        <h3 className=" font-medium leading-6 text-gray-900 text-lg">Compare Keywords</h3>
        <MultiStepForm onSubmit={handleFormSubmit} onClose={onClose}/>
     
      </div>
    </div>
  );
};

export default ComparePopUp;
