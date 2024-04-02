import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({ isModalOpen, queryInfo, onClose ,index}) => {
  if (!isModalOpen || !queryInfo) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal w-[20%] mx-auto flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4 flex-auto bg-white rounded-md shadow-md animated-modal">
          <div className="flex justify-end">
            <button onClick={onClose} className="text-white bg-blue rounded-md p-1 ">
              <MdClose size={18}/>
            </button>
          </div>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Query: {queryInfo.keywords}
          </p>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            targetUrl: {queryInfo.targetUrl}
          </p>
          {queryInfo.rank !== undefined && (  
            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
              Rank: {queryInfo.rank}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
