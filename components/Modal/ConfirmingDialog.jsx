
import React from 'react';

// Import a spinner component or create a simple one
const Spinner = () => <div className="w-4 h-4 mx-2 border-b-2 border-white rounded-full animate-spin"></div>;

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 grid w-screen h-screen transition-opacity duration-300 bg-black pointer-events-auto place-items-center bg-opacity-30 backdrop-blur-sm">
    
  
   <div className="pointer-events-auto fixed inset-0 z-[999] 
    grid h-screen w-screen place-items-center bg-opacity-30 opacity-100	 backdrop-blur-sm transition-opacity duration-300">



    <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-lg">
        <p className="text-lg">{message}</p>
        <div className="flex justify-end mt-4 space-x-4">
          <button
            className="px-4 py-2 font-bold text-black bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="flex items-center px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <><Spinner /> Deleting...</> : 'Delete'}
          </button>
          <button
            className="flex items-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
