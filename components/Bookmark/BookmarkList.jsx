
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookmarkItem from './BookmarkItem';
import { fetchBookmarks } from '../../redux/lib/displayBookmarks';
import { createBookmark } from '../../redux/lib/createGroup';
import { FiPlus } from "react-icons/fi";
import { toast } from 'react-toastify';
import { fetchFavorites } from '../../redux/lib/favoritesSlice';

const BookmarkList = ({ bookmarks, searchBookmark,averageRanksByBId }) => {
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const displayBookmarkSlice = useSelector((state) => state.displayBookmarkSlice.bookmarks);
  const [expandedBookmarkId, setExpandedBookmarkId] = useState(null);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.authSlice?.user?.id);

  useEffect(() => {
    setFilteredBookmarks(
      displayBookmarkSlice.filter(bookmark =>
        bookmark.name.toLowerCase().includes(searchBookmark.toLowerCase())
      )
    );
  }, [displayBookmarkSlice, searchBookmark]);

  const handleCreateBookmark = async () => {
    if (newBookmarkName.trim() === '') {
      return;
    }
  
    // Check if the bookmark name already exists
    const nameExists = displayBookmarkSlice.some(
      (bookmark) => bookmark.name.toLowerCase() === newBookmarkName.toLowerCase()
    );
  
    if (nameExists) {
      toast.error('A bookmark with this name already exists. Please choose a different name.');
      return;
    }
  
    const newBookmarkData = {
      name: newBookmarkName,
    };
  
    try {
      const createdBookmark = await dispatch(createBookmark(newBookmarkData)).unwrap();
      setFilteredBookmarks([...filteredBookmarks, createdBookmark]);
      setNewBookmarkName('');
      fetchAllBookmarks();
      toast.success(`Bookmark "${newBookmarkName}" created successfully!`);
    } catch (error) {
      console.error('Failed to create bookmark:', error);
      toast.error(`Failed to create bookmark: ${error.message}`);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateBookmark();
    }
  };
  const fetchAllBookmarks = async () => {
    await dispatch(fetchBookmarks());
  };
  const [selectedFavorites, setSelectedFavorites] = useState(null); // State to store selected favorites

  const handleBookmarkClick = (b_id) => {
    dispatch(fetchFavorites(b_id)).then((favorites) => {
      setSelectedFavorites(favorites);
      // Optionally, filter the DataTableComponent here if necessary
    });
  };
  


  const handleDeleteBookmark = async (userId, bookmarkId) => {
    // Find the bookmark to get its name for the toast message
    const bookmarkToDelete = filteredBookmarks.find(b => b.b_id === bookmarkId);
    if (!bookmarkToDelete) {
        console.error('Bookmark not found');
        return;
    }

  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bookmarks/delete/${userId}/${bookmarkId}/`, {
          method: 'DELETE',
      });

        if (!response.ok) {
            throw new Error('Error deleting bookmark');
        }

        // Update the state to remove the deleted bookmark
        setFilteredBookmarks(filteredBookmarks.filter(bookmark => bookmark.b_id !== bookmarkId));

        // Optionally, fetch updated bookmarks list
        fetchAllBookmarks();

        // Show toast notification with the bookmark name
        toast.info(`Bookmark "${bookmarkToDelete.name}" deleted successfully`);
    } catch (error) {
        console.error('Failed to delete bookmark:', error);
        // Handle error (show message to user, etc.)
        toast.error(`Failed to delete bookmark: ${error.message}`);
    }
};

const handleRenameBookmark = async (bookmarkId, newName) => {
  const bookmarkToRename = filteredBookmarks.find(b => b.b_id === bookmarkId);
  if (!bookmarkToRename) {
    console.error('Bookmark not found');
    return;
  }
  const oldName = bookmarkToRename.name;
  const baseUrl = process.env.REACT_APP_BASE_URL;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bookmarks/update/${userId}/${bookmarkId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      throw new Error('Error updating bookmark');
    }

    // Update the local state to reflect the change
    setFilteredBookmarks(filteredBookmarks.map(bookmark => {
      if (bookmark.b_id === bookmarkId) {
        return { ...bookmark, name: newName };
      }
      return bookmark;
    }));
  
    fetchAllBookmarks();
    toast.success(`Bookmark renamed from "${oldName}" to "${newName}"`);
  } catch (error) {
    console.error('Failed to update bookmark:', error);
    toast.error(`Failed to rename bookmark: ${error.message}`);
  }
};




  return (
    <div className=" rounded z-[10000] mt-4 listtest">
    
<div className="flex justify-between mb-2">
  <div className="relative flex-grow">
    <input
      type="text"
      placeholder="Add Bookmark ...."
      className="border rounded px-2 h-[30px] w-full focus:outline-none pr-10" // Increased padding-right to make space for the icon
      value={newBookmarkName}
      onChange={(e) => setNewBookmarkName(e.target.value)}
      onKeyPress={handleKeyPress} // Add the key press listener here

    />
    <button
      className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-white cursor-pointer bg-blue rounded-r-md hover:bg-blue-dark" // Adjusted classes for positioning
      onClick={handleCreateBookmark}
    >
      <FiPlus size={16} />
    </button>
  </div>
</div>


     <div className='overflow-auto Book_list h-[300px]'>
     <div className="overflow-visible rounded-sm ">
      {filteredBookmarks.map((bookmark) => (
      <BookmarkItem

        key={bookmark.b_id}
        bookmark={bookmark}
        handleBookmarkClick={() => handleBookmarkClick(bookmark.b_id)}
        isExpanded={expandedBookmarkId === bookmark.b_id}
        averageRank={averageRanksByBId[bookmark.b_id] || 0} 
        handleDeleteBookmark={() => handleDeleteBookmark(userId, bookmark.b_id)}
        onRename={handleRenameBookmark}



      />
    ))}
      </div>
     </div>

    </div>
  );
};

export default BookmarkList;
