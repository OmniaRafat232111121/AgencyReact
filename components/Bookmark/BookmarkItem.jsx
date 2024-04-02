
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FaFolder, FaChevronDown, FaFolderOpen, FaEdit, FaSave, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { FaEllipsisV, FaTrash } from 'react-icons/fa';
import { Menu } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchFavorites} from '../../redux/lib/favoritesSlice'
import axios from 'axios';
const BookmarkItem = ({ bookmark, onRename, isExpanded, averageRank, handleDeleteBookmark }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newName, setNewName] = useState(bookmark.name);
  const [droppedItems, setDroppedItems] = useState([]);
  const tableData = useSelector((state) => state.tableSlice.data);
  const userId = useSelector(state => state?.authSlice?.id);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const handleRename = () => {
    onRename(bookmark.b_id, newName);
    setIsEditMode(false);
  };
 

  const roundedAverageRank = averageRank ? averageRank.toFixed(1) : '0';



const handleDragOver = (e) => {
  e.preventDefault(); // This is necessary to allow for dropping
};

// const handleDrop = (e) => {
//   e.preventDefault();
//   const droppedData = e.dataTransfer.getData("application/json");
//   const droppedItem = JSON.parse(droppedData);
//   console.log(droppedItem)

//   // Add the dropped item to the state
//   setDroppedItems((currentItems) => [...currentItems, droppedItem]);
  
// };




// const handleBookmarkClick = async (bookmark) => {
//   setIsLoading(true);
//   setError(null);

//   try {
//     const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/DisplayFavos/${userId}/${bookmark.b_id}/`);
//     if (response.status === 200) {
//         // Set the fetched favorites for this bookmark
//         setFavorites(prevFavorites => ({
//           ...prevFavorites,
//           [bookmark.b_id]: response.data,
//         }));
//         console.log(favorites)
//     } else {
//       console.log(`Failed to fetch favorites for '${bookmark.name}', status: ${response.status}`);
//     }
//   } catch (err) {
//     console.error(`Error fetching favorites for '${bookmark.name}':`, err);
//     setError(err.message);
//   } finally {
//     setIsLoading(false);
//   }

//   // Log the dropped items and favorites for this bookmark
//   const itemsForThisBookmark = droppedItems[bookmark.b_id] || [];
//   console.log(`Clicked Bookmark - Name: '${bookmark.name}', b_id: ${bookmark.b_id}, user_id: ${userId}`);
//   console.log(`Dropped items for '${bookmark.name}':`, itemsForThisBookmark);
//   console.log(`Favorites for '${bookmark.name}':`, favorites[bookmark.b_id] || []);
// };

// const handleDrop = (e) => {
//   e.preventDefault();
//   const droppedData = e.dataTransfer.getData('application/json');
//   const droppedItem = JSON.parse(droppedData);

//   // Add the dropped item into the droppedItems state under the bookmark ID
//   setDroppedItems(prev => ({
//     ...prev,
//     [bookmark.b_id]: [...(prev[bookmark.b_id] || []), droppedItem]
//   }));
// };
const handleDrop = async (event) => {
  event.preventDefault();
  
  // Parse the JSON data from the dropped item
  const droppedDataString = event.dataTransfer.getData("text/plain");
  if (!droppedDataString) {
    console.error("Dropped data is empty");
    return;
  }

  const { query, target_url, google_domain } = JSON.parse(droppedDataString);
  const b_id = bookmark.b_id; // ID of the bookmark where the item is being dropped

  // Construct the API URL with appropriate parameters
  const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${encodeURIComponent(query)}/${encodeURIComponent(target_url)}/${encodeURIComponent(google_domain)}/${b_id}/`;

  try {
    // Perform the API request to create a favorite
    const response = await axios.post(apiUrl);
    if (response.status === 200 || response.status === 201) {
      console.log("Favorite created successfully", response.data);
      // Optionally refresh the list of favorites here or show a success message
    } else {
      console.error("Failed to create favorite", response);
      // Optionally handle the failure case, e.g., by showing an error message
    }
  } catch (error) {
    console.error("Error creating favorite", error);
    // Optionally handle the error case, e.g., by showing an error message
  }
};

const handleBookmarkClick = async () => {
  setSelectedBookmark(bookmark);

  setIsLoading(true);
  setError('');

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/DisplayFavos/${userId}/${bookmark.b_id}/`);
    const ranks = response.data.map(item => item.rank);
    if (response.status === 200) {
      setFavorites(prev => ({
        ...prev,
        [bookmark.b_id]: ranks
      }));
      console.log(favorites)
    } else {
      console.log(`Failed to fetch favorites for '${bookmark.name}', status: ${response.status}`);
    }
  } catch (err) {
    console.error(`Error fetching favorites for '${bookmark.name}':`, err);
    setError(err.message);
  } finally {
    setIsLoading(false);
  }

  // Combine API fetched favorites with dropped items for this bookmark
  

  console.log(`Favorites for '${bookmark.name}':`, );
};

  return (
    <div 
    onDragOver={handleDragOver}
    onDrop={handleDrop} // Pass bookmark ID to handleDrop

     className="flex items-center justify-between p-2 text-black bg-white rounded-md cursor-pointer hover:bg-blue-100">
    
    <button 
    className="flex items-center flex-grow">
        {isExpanded ? (
          <>
            <FaChevronDown className="mr-2" />
            <FaFolderOpen className="text-blue" />
          </>
        ) : (
          <>
            <div className='flex items-center justify-center'>
              <FaFolder className="mr-2 text-blue" />
              {isEditMode ? (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-grow font-semibold text-gray-700"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleRename();
                    }
                  }}
                />
              ) : (
                <span
                onClick={() => handleBookmarkClick(bookmark)} 
                 className="flex-grow font-semibold text-gray-700">
                {bookmark.name}
              </span>
              

              )}
            </div>
          </>
        )}
      </button>
      <div className='flex items-center '>
      

        <p className="mr-2 text-gray-500 whitespace-nowrap">
          [ {roundedAverageRank} ]
        </p>



<Menu as="div" className="relative inline-block text-left ">
          <Menu.Button as="button" className="inline-flex justify-center text-sm text-black rounded-md focus:outline-none">
            <FaEllipsisV className="text-xl" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-[25px]  mt-2  origin-top-right bg-white divide-y z-[10000] w-[100px]
             divide-gray-100 rounded-md shadow-lg focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <Link to={`/BookmarkDetails/${bookmark.b_id}`} 
                    className={`'text-gray-900'}
                     group flex items-center rounded-md px-2 py-2 text-sm`}>
                      <FaEye className={` mr-2`} aria-hidden="true" />
                      View
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => setIsEditMode(true)} 
                    className={`'text-gray-900'} 
                    group flex items-center rounded-md px-2 py-2 text-sm`}>
                      <FaEdit className={` mr-2`} aria-hidden="true" />
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => handleDeleteBookmark(bookmark.b_id)}
                     className={` text-gray-900
                     group flex items-center rounded-md px-2 py-2 text-sm`}>
                      <FaTrash className={` mr-2`} aria-hidden="true" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>



   



      </div>
    </div>
  );
};

export default BookmarkItem;




