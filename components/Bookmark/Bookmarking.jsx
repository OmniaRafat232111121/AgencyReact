import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Bookmarking = () => {
  const bookmarks = useSelector((state) => state.displayBookmarkSlice.bookmarks);
  const navigate = useNavigate(); 

  const handleViewClick = (bookmarkId) => {
    navigate(`/BookmarkDetails/${bookmarkId}`); // Navigate to the bookmark details page
  };

  return (
    <div className="p-4 bg-gray-100  mr-[10px] rounded-lg shadow space-y-2 ">
      <h3 className="text-lg font-semibold text-blue">Bookmarks:</h3>
      {bookmarks.map((bookmark, index) => (
        <div key={index} className="px-3 py-2 bg-white rounded-md shadow-sm flex items-center justify-between">
          <span className="text-sm text-gray-600">{bookmark.name}</span>
          <button
            className="text-blue hover:text-blue transition-colors duration-200"
            onClick={() => handleViewClick(bookmark.b_id)} // Use handleViewClick to navigate
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default Bookmarking;
