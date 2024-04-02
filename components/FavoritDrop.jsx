import React, { useState } from 'react';
import { MdFavoriteBorder, MdAdd } from 'react-icons/md';
import Createbookmark from './Createbookmark';
import { useSelector } from 'react-redux';

const FavoritDrop = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const bookmarks = useSelector((state) => state.createBookmarkSlice.bookmarks); 
  const bookmarkks = useSelector((state) => state.displayBookmarkSlice.bookmarks);

  const handleFavoriteClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateFormToggle = () => {
    setIsCreateFormVisible(!isCreateFormVisible);
  };

  return (
    <div className="relative">
      <button
        onClick={handleFavoriteClick}
        className="text-gray-400 px-2 py-1 rounded-lg border border-gray-400 ml-2"
      >
        <MdFavoriteBorder />
      </button>
      {isDropdownOpen && (
        <div className="absolute top-8 left-10 mt-2 w-[180px] bg-white border shadow-dropdown border-gray-100 rounded-[10px] z-10 max-h-[300px] overflow-y-auto">
          <ul className="py-2">
            {/* Render bookmarks here */}
            {bookmarkks.map((bookmark) => (
              <li
                key={bookmark.id}
                className="px-2 py-2 text-start text-[11px] hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              >
                {bookmark.name}
              </li>
            ))}
            {/* Render create bookmark form */}
            {isCreateFormVisible && (
              <li className="px-4 py-2 bg-white">
                <Createbookmark />
              </li>
            )}
            <li
              className="px-4 py-2 bg-white flex justify-between cursor-pointer"
              onClick={handleCreateFormToggle}
            >
              Create New Bookmark
              <MdAdd className="ml-2 mt-1" />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FavoritDrop;
