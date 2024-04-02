import React from "react";
import { MdClose } from "react-icons/md";

const UpdateModal = ({ isModalOpen, queryInfo, onClose }) => {
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
          <p className="my-4 text-blue text-lg font-semibold  leading-relaxed">
          Query:  <span className="text-black">  {queryInfo.query}
          </span>
          </p>
          <p className="my-4 text-blue text-lg font-semibold leading-relaxed">
            TargetUrl: <span className="text-black">{queryInfo.targetUrl}
            </span>
          </p>
          {queryInfo.rank !== undefined && (
            <p className="my-4 text-blue text-lg  font-semibold leading-relaxed">
              Rank: <span className="text-black">{queryInfo.rank}</span>
            </p>
          )}
          
       
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
