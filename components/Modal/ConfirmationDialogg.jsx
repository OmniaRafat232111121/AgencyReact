import React from 'react';

const Spinner = () => <div className="w-4 h-4 mx-2 border-b-2 border-white rounded-full animate-spin"></div>;

const ConfirmationDialogg = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  isLoading = false, 
}) => {
  if (!isOpen) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-30 opacity-100 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-lg">
        <p className="text-lg">{message}</p>
        <div className="flex justify-end mt-4 space-x-4">
          <button
            className="px-4 py-2 font-bold text-black bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="flex items-center px-4 py-2 font-bold text-white rounded bg-blue hover:bg-blue-700"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <><Spinner /> Processing...</> : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialogg;
