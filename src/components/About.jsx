import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import ClipLoader from "react-spinners/ClipLoader";
import { ImSpinner11 } from "react-icons/im";
import {
  FaFolder,FaEdit, FaEllipsisV,FaArrowUp,FaArrowDown ,
  FaChevronUp, FaRegFileAlt, FaLink, FaRegIdBadge, FaRegCalendarAlt, FaArrowLeft,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { keywordschema } from '../utils/validation';
import axios from 'axios';
import EGYPT from '../assets/images/EGYPT.png'
import USA from '../assets/images/USA.png'
import AE from '../assets/images/DUBAI.png'
import LocationFilter from './LocationFilter';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { FaPlus } from 'react-icons/fa'; // Importing an icon
import { BiDotsVertical } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { FaArrowsToEye } from "react-icons/fa6";
import { Menu } from '@headlessui/react';
import SearchBar from './ranktracker/Searchbar';
import { resetFavorites } from '../redux/lib/favoritesSlice'
import { fetchData } from '../redux/lib/fetchData';
import { addKeyword } from '../redux/lib/keyword';
import TabsProjects from './Tabs/TabsProjects';
import { deleteProject } from '../redux/lib/deleteProject';
import { FiSearch } from 'react-icons/fi';
import { fetchBookmarks } from '../redux/lib/displayBookmarks';
import { FiPlus } from "react-icons/fi";
import { createBookmark } from '../redux/lib/createGroup';
import BookmarkDetails from './Bookmark/BookmarkDetails';
import useOutsideClick from '../hook/useOutsideClick';

const Projectranks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedBookmarkName, setSelectedBookmarkName] = useState('');
  const [selectedBookmarkId, setSelectedBookmarkId] = useState(null);
  const [editingBookmarkId, setEditingBookmarkId] = useState(null);
  const [bookmarkNames, setBookmarkNames] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const projectDetails = location.state?.projectDetails;
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const detailData = useSelector((state) => state.favoritesSlice.favorites);
  const [updateErrors, setUpdateErrors] = useState(0);
  const [totalUpdates, setTotalUpdates] = useState(0);
  const [completedUpdates, setCompletedUpdates] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(true); // New state
  const [fadeOut, setFadeOut] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showBookmarkSelector, setShowBookmarkSelector] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const mainOptionsRef = useRef(null);
  const bookmarksRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      // Close main options menu if click is outside
      if (mainOptionsRef.current && !mainOptionsRef.current.contains(event.target)) {
        setShowMainOptions(false);
      }
      // Close bookmarks submenu if click is outside
      if (bookmarksRef.current && !bookmarksRef.current.contains(event.target)) {
        setShowBookmarkSelector(false);
      }
    }
  
    // Attach the listener to the document
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      // Clean up the listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
    
  // Function to toggle the visibility of the tooltip
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const locationImages = {
    US: USA,
    EG: EGYPT,
    AE: AE
    // Add more as needed
  };

  const [totalAdds, setTotalAdds] = useState(0);
  const [completedAdds, setCompletedAdds] = useState(0);
  const [addErrors, setAddErrors] = useState(0);
  const [showAddProgressBar, setShowAddProgressBar] = useState(false);

  const operationsCompleted = !showAddProgressBar && !showProgressBar;

  //update progressbar 

  useEffect(() => {
    const updatesComplete = completedUpdates === totalUpdates;
    const updatesWithError = (completedUpdates + updateErrors) === totalUpdates;

    if ((updatesComplete || updatesWithError) && showProgressBar) {
      
      setFadeOut(true);

      // Wait for the fade-out animation to complete
      const fadeOutTimer = setTimeout(() => {
        setShowProgressBar(false);
        setFadeOut(false);

        setCompletedUpdates(0);
        setUpdateErrors(0);
        setTotalUpdates(0);
      }, 5000);

      return () => {
        clearTimeout(fadeOutTimer);
      };
    }
  }, [completedUpdates, updateErrors, totalUpdates, showProgressBar]);

  // //Add progressbar 

  useEffect(() => {
    const addsComplete = completedAdds === totalAdds;
    const addsWithError = (completedAdds + addErrors) === totalAdds;

    if ((addsComplete || addsWithError) && showAddProgressBar) {
      // Use fade-out effect if needed
      // setFadeOut(true); // Uncomment if you manage fade-out effect for adds as well

      const timer = setTimeout(() => {
        setShowAddProgressBar(false); // Hide the add progress bar after the delay
        // setFadeOut(false); // Reset fade-out effect if applicable

        // Optionally reset add operation states
        setCompletedAdds(0);
        setAddErrors(0);
        setTotalAdds(0);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [completedAdds, addErrors, totalAdds, showAddProgressBar]); // Dependencies include the add operation state and the visibility of the add progress bar

// utils.js
const truncateText = (text, maxLength = 15) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};




  const isSidebarOpen = useSelector((state) => state.SidebarSlice.isOpen);

  const [searchBookmark, setSearchBookmark] = useState('');



  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  const handleSearchBookmark = (e) => {
    setSearchBookmark(e.target.value);
  };


  const handleBookmarkClick = async (bookmark) => {
    const bookmarkId = bookmark.b_id; // Assuming this is how you access the bookmark ID
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/DisplayFavos/${userId}/${bookmarkId}/`;
    setSelectedBookmarkName(bookmark.name); // Update the selected bookmark name
    setSelectedBookmarkId(bookmarkId); // Update the selected bookmark ID

    try {
      const response = await axios.get(apiUrl);
      const favoritesData = response.data;
      const rankData = favoritesData.map(favourite => favourite.rank);
      console.log(rankData)

      setFilteredData(rankData);
      setIsFolderSelected(true);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to fetch favorites. Please try again.");
    }
  };





  const tableData = useSelector((state) => state.tableSlice.data);

  const [filteredData, setFilteredData] = useState(tableData);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate the currently displayed rows
  // Calculate current page rows within the component body (outside of useEffect)
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const handleRowClick = (query_id) => {
    setExpandedRowId(expandedRowId === query_id ? null : query_id);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the table
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        // Clicked outside the table, clear the selected rows
        setSelectedRows([]);
      }
    };

    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount


  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedTargetUrl, setSelectedTargetUrl] = useState('All Sources');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [folderRanks, setFolderRanks] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const toggleDropdown = (query_id) => {
    setActiveDropdown(activeDropdown === query_id ? null : query_id);
  };
  const [isItemDropped, setIsItemDropped] = useState(false);
  const [isSidebarOpenn, setIsSidebarOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);






  const [isModal_Open, setIsModal_Open] = useState(false);
  const open_Modal = () => setIsModal_Open(true);
  const close_Modal = () => setIsModal_Open(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    value: 'EG',
    label: 'Egypt',
    icon: <img src={EGYPT} alt="Egypt" />,
  });
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All Locations');
  const [updatingRows, setUpdatingRows] = useState(new Set());

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetUrls, setSelectedTargetUrls] = useState([]);
  const animatedComponents = makeAnimated();
  const [dataFetched, setDataFetched] = useState(false);
  const [queryInfo, setQueryInfo] = useState(null);
  const [isDropped, setIsDropped] = useState(false);
  const { userId, projectId } = useParams();
  console.log(projectId)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const locationOptions = [
    { value: 'All Locations', label: 'All Locations' },
    { value: 'US', label: 'USA', icon: <img src={USA} alt="USA" /> },
    { value: 'EG', label: 'Egypt', icon: <img src={EGYPT} alt="Egypt" /> },
    { value: 'AE', label: 'Dubai', icon: <img src={AE} alt="Dubai" /> },
  ];

  useEffect(() => {
    // Reset data when location filter changes
    const resetDataByLocation = () => {
      if (selectedLocationFilter === 'All Locations') {
        // If 'All Locations' is selected, reset to original dataset
        setFilteredData(tableData);
      } else {
        // Filter data based on selected location
        const newData = tableData.filter(item => item.google_domain === selectedLocationFilter);
        setFilteredData(newData);
      }
    };

    // Call the reset function when the location filter changes
    resetDataByLocation();
  }, [selectedLocationFilter, tableData]);


  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const updateFilteredData = () => {
    let filteredResult = [...tableData];

    // Apply search query filter, if any
    if (searchQuery) {
      const queryRegex = new RegExp(searchQuery, 'i');
      filteredResult = filteredResult.filter(
        (item) => queryRegex.test(item.query)
      );
    }

    // Apply target URL filter, unless "All Sources" is selected
    if (selectedTargetUrl !== 'All Sources') {
      filteredResult = filteredResult.filter((item) => {
        const normalizedUrl = item.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
        return normalizedUrl === selectedTargetUrl || item.target_url === selectedTargetUrl;
      });
    }

    // Apply location filter, unless "All Locations" is selected
    if (selectedLocationFilter !== 'All Locations') {
      filteredResult = filteredResult.filter((item) => item.google_domain === selectedLocationFilter);
    }

    // Handling no data scenario after applying all filters
    if (filteredResult.length === 0) {
      setFilteredData([{ noDataIndicator: true }]);
    } else {
      setFilteredData(filteredResult);
    }
  };

  useEffect(() => {
    updateFilteredData();
  }, [searchQuery, selectedTargetUrl, selectedLocationFilter, tableData]);


  const NoDataComponent = () => (
    <div className="text-center" style={{ padding: '20px', gridColumn: '1 / -1' }}>
      No data
    </div>
  );





  useEffect(() => {
    if (!dataFetched) {
      setLoading(true);
      // Pass userId and projectId as arguments to fetchData
      dispatch(fetchData({ userId, projectId }))
        .unwrap() // Using unwrap to handle the promise correctly
        .then(() => {
          setDataFetched(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [dispatch, userId, projectId, dataFetched]);

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);
  useEffect(() => {
    updateFilteredData();
  }, [searchQuery, selectedTargetUrls, tableData]);
  const uniqueTargetUrls = [
    'All Sources',
    ...new Set(tableData.map((item) => item.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')))
  ];
  const handleDeleteButtonClick = (query_id) => {
    console.log(query_id)
    dispatch(deleteProject(query_id))
      .unwrap()
      .then(() => {
        setFilteredData(currentData =>
          currentData.filter(rank => rank.query_id !== query_id)
        );
        toast.info('Rank deleted successfully');
      })
      .catch((error) => {

        console.error('Error deleting rank:', error);

        toast.error(`An error occurred: ${error?.message || 'Unknown error'}`);
      });
  };


  const handleUpdateButtonClick = async (event, userId, query_id, project_id) => {
    event.stopPropagation();

    setShowProgressBar(true);
    setTotalUpdates(prev => prev + 1);
  
    let requestSuccessful = false; // Flag to indicate whether the request was successful
    const retryLimit = 5; // Reasonable retry limit
    let retryCount = 0;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const makeRequest = async () => {
        if (requestSuccessful) return; // If already successful, no need to proceed

        try {
            setUpdatingRows(prev => ({ ...prev, [query_id]: true }));
            setIsUpdating(true);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-rank/${userId}/${query_id}/${project_id}/`, {});
   
            if (response.status === 200) {

          setFilteredData(currentData => {
            const updatedItemIndex = currentData.findIndex(item => item.query_id === query_id);
            const updatedItem = { ...currentData[updatedItemIndex], ...response.data };
            // Move the updated item to the top and reconstruct the array.
            const newData = [updatedItem, ...currentData.slice(0, updatedItemIndex), ...currentData.slice(updatedItemIndex + 1)];
            return newData;
        });

          toast.success(`${response.data.query} update successful`);
          setCompletedUpdates(prev => prev + 1);
            
                requestSuccessful = true; // Mark as successful to prevent retries
            } else {
                throw new Error('Update failed');
            }
          
            
        } catch (error) {
            console.error('Error updating rank:', error);
          
            // if (error.response && [404, 500, 504].includes(error.response.status) && retryCount < retryLimit) {
              if (error.response.status !== 200 && retryCount < retryLimit) {

                retryCount += 1;
                console.log(`Retrying update... Attempt ${retryCount}`);
                await wait(2000 * retryCount);
                await makeRequest(); // Retry the request
            } else {
                toast.error(`An error occurred while updating the rank. Error status: ${error.response ? error.response.status : 'unknown'}`);
                setUpdateErrors(prevErrors => prevErrors + 1);
            }
        } finally {
            if (requestSuccessful || retryCount >= retryLimit) {
                setUpdatingRows(prev => ({ ...prev, [query_id]: false }));
                setIsUpdating(false);
                
            }
        }
    };

    await makeRequest(); // Start the request process
};


const handleBulkUpdate = async () => {
  console.log("userId:", userId, "projectId:", projectId, "checkedRows:", checkedRows);
  console.log("Number of queries selected for update:", checkedRows.length);

  if (!userId || !projectId || checkedRows.length === 0) {
    console.error("Missing userId, projectId, or no rows selected for bulk update.");
    return;
  }

  // Set the total number of updates to the length of checkedRows
  setTotalUpdates(checkedRows.length);

  // Reset the completed updates and error counts
  setCompletedUpdates(0);
  setUpdateErrors(0);

  // Show the progress bar
  setShowProgressBar(true);
  
  
  const updatePromises = checkedRows.map((queryId) => 
    handleUpdateButtonClick({ stopPropagation: () => {} }, userId, queryId, projectId)
  );


  await Promise.allSettled(updatePromises).then((results) => {
    const successfulUpdates = results.filter((result) => result.status === 'fulfilled');
    const errors = results.filter((result) => result.status === 'rejected');

    // Update the state with the number of successful updates and errors
    setCompletedUpdates(successfulUpdates.length);
    console.log(completedUpdates)
    setUpdateErrors(errors.length);
    
  console.log(totalUpdates)
    console.log(`Bulk update results:`, results);
    console.log(`Successful updates: ${successfulUpdates.length}, Errors: ${errors.length}`);
  });

  // Hide the progress bar after processing
  setShowProgressBar(false);

  // Reset checked rows
  setCheckedRows([]);
};



useEffect(() => {
  console.log(`Completed updates after bulk update: ${completedUpdates}`);
  console.log(`Total updates after bulk update: ${totalUpdates}`);
}, [completedUpdates, totalUpdates]);

  useEffect(() => {
    if (totalUpdates > 0) {
      const newProgress = (completedUpdates / totalUpdates) * 100;
      setOverallProgress(newProgress);
    }
  }, [completedUpdates, totalUpdates]);


  const renderSharedProgressBar = () => {
    if (!progressBarVisible) return null;

    const isLoading = completedUpdates + updateErrors < totalUpdates;
    const hasErrors = updateErrors > 0; // Check if there are any errors
    const isCompleteOrHasError = completedUpdates > 0 || hasErrors; // Adjusted logic to consider any progress as completion

    // Choose progress bar color based on state
    // If there are errors, but some updates are successful, show a different color (e.g., orange) to indicate partial success with issues.
    const progressBarColor = hasErrors ? (completedUpdates > 0 ? 'bg-orange-500' : 'bg-red-500') : 'bg-green-500';

    // Text color based on the completion and error status
    const textColor = hasErrors ? 'text-red-500' : 'text-green-500';

    const progressBarWidth = `${Math.min((completedUpdates / totalUpdates) * 100, 100)}%`;

    return (
      <div className="my-2">
        <div className=" progress-bar-striped   bg-gray-200 rounded-full h-[5px] overflow-hidden">
          <div
            className={` progress-bar-striped ${fadeOut ? 'fade-out' : ''}
             h-full rounded-full ${progressBarColor} transition-all duration-500`}
            style={{ width: progressBarWidth }}
          >
            {isCompleteOrHasError && (
              <div className="flex items-center justify-end h-full pr-2">
                {hasErrors ? (
                  <svg className="w-4 h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg> // Checkmark for success
                )}
              </div>
            )}
          </div>
        </div>
        <span className={`${textColor} text-sm mt-[10px]`}>
          {isCompleteOrHasError ? `Completed with ${completedUpdates} success${completedUpdates > 1 ? 'es' : ''} and ${updateErrors} error${updateErrors > 1 ? 's' : ''}` : "Loading..."}
        </span>
        {hasErrors && <div className="mt-2 text-sm text-red-500">Some updates failed.</div>}
        {/* {!hasErrors && completedUpdates > 0 && <div className="mt-2 text-sm text-green-500">Update Completed Successfully!</div>} */}
      </div>
    );
  };

  const AddProgressBar = () => {
    // Calculate the percentage of progress.
    const progressPercent = totalAdds > 0 ? (completedAdds / totalAdds) * 100 : 0;
    const hasErrors = addErrors > 0;
    const progressBarColor = hasErrors ? 'bg-red-500' : 'bg-green-500';
    const textColor = hasErrors ? 'text-red-500' : 'text-green-500';

    return (
      <div className="my-2">
        <div className="progress-bar-striped bg-gray-200 rounded-full h-[20px] overflow-hidden">
          <div
            className={`h-full rounded-full ${progressBarColor} transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className={`${textColor} text-sm mt-[10px]`}>
          Processed: {completedAdds}/{totalAdds}
          {hasErrors && ` with ${addErrors} error(s)`}
        </span>
        {hasErrors && (
          <svg className="w-4 h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {!hasErrors && completedAdds > 0 && (
          <div className="mt-2 text-sm text-green-500">
            Addition Completed Successfully!
          </div>
        )}
      </div>
    );
  };










  const formattedDate = (date) => {
    if (!date) {
      return 'No Date Provided'; // Handle undefined or null dates
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj)) {
      return 'Invalid Date'; // Handle invalid dates
    }
    return format(dateObj, 'dd MMM yyyy'); // Format valid dates
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleTargetUrlFilterChange = (selectedOption) => {
    setSelectedTargetUrl(selectedOption ? selectedOption.value : 'All Sources');
  };

  const { handleSubmit, control, register, reset, formState: { errors } } = useForm({
    defaultValues: {
      url: projectDetails?.url  // Set the initial value
    },
    resolver: zodResolver(keywordschema),
  });










  const handleDragOver = (e) => {
    e.preventDefault(); // This is necessary to allow for dropping
  };




  useEffect(() => {
    if (!userId || !projectId) {
      console.error("userId or projectId is undefined");
    }
  }, [userId, projectId]);






// Function to extract the domain name from a given URL
const extractDomainName = (url) => {
  try {
    // Create a new URL object from the input URL string
    const parsedUrl = new URL(url);
    // Extract the hostname from the URL object
    let hostname = parsedUrl.hostname;
    // Optional: Remove 'www.' from the hostname if present
    hostname = hostname.replace(/^www\./, '');
    return hostname;
  } catch (error) {
    console.error('Invalid URL', error);
    return ''; // Return an empty string or any default/error value you prefer
  }
};

  
  const onBulkSubmit = async (data) => {
    setIsDataLoading(true);
    close_Modal();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsAdding(true);
    const currentUrl = data.url;

    reset({ keywords: '' ,
    url: currentUrl, 
  });

    const currentDate = new Date();
    const queries = data.keywords.split('\n').map(line => line.trim()).filter(line => line);
    const domainName = extractDomainName(currentUrl); // Use the extract function
    console.log(domainName)

    setTotalAdds(queries.length);
    setCompletedAdds(0);
    setAddErrors(0);
    setShowAddProgressBar(true); // Show the progress bar

    const tempKeywordData = queries.map(query => ({
      query,
      target_url: domainName,
      google_domain: selectedLocation?.value,
      temp: true,
      date: currentDate,
      rank: 'Loading...',
      best_rank: 'Loading...',
      origin: 'Loading...',
    }));

    setFilteredData(currentData => [...tempKeywordData, ...currentData]);

    for (const query of queries) {
      await retryRequest(query, data.url, selectedLocation?.value);
    }

    setIsSubmitting(false);
    setIsAdding(false);
    setIsDataLoading(false);
    setHasSubmitted(true);
  };

  const retryRequest = async (query, targetUrl, googleDomain) => {
    const retryLimit = 9999999;
    let attempt = 0;
    let requestSuccessful = false;

    while (attempt < retryLimit && !requestSuccessful) {
      try {
        const response = await dispatch(addKeyword({
          keywordData: { query, target_url: targetUrl, google_domain: googleDomain },
          userId,
          projectId
        })).unwrap();

        if (response && Array.isArray(response) && response.length > 0) {
          // Handle successful request
          const rankData = response[0][0];
          updateFilteredDataWithSuccess(query, rankData);
          requestSuccessful = true;
        } else {
          throw new Error('Invalid response format or no data returned for query: ' + query);
        }
      } catch (error) {
        console.error('Error adding keyword:', error);
        if (!error.response || ![404, 500].includes(error.response.status)) {
          // Break out of the loop if error is not 404 or 500
          break;
        }
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential back-off
      }
    }

    if (!requestSuccessful) {
      // Handle failed request after all attempts
      // updateFilteredDataWithError(query);
    }
  };

  const updateFilteredDataWithSuccess = (query, rankData) => {
    setFilteredData(currentData => {
      return currentData.map(item => {
        if (item.temp && item.query === query) {
          return {
            ...item,
            rank: rankData.rank,
            best_rank: rankData.rank, // Assuming this is the best rank
            source_url: rankData.source_url,
            temp: false
          };
        }
        return item;
      });
    });
    toast.success(`"${query}" added successfully with rank: ${rankData.rank}`);
    setCompletedAdds(prev => prev + 1);
  };

  useEffect(() => {
    const savedRanks = localStorage.getItem('folderRanks');
    if (savedRanks) {
      setFolderRanks(JSON.parse(savedRanks));
    }
  }, []);

  const showDroppedNotification = () => {
    if (draggedItem) {
      toast.info(`'${draggedItem.query}' has been dragged into '${draggedItem.bookmark}'!`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };
  useEffect(() => {
    if (isItemDropped) {
      showDroppedNotification();
      setIsItemDropped(false);
      // Reset the state
    }
  }, [isItemDropped]);

  // const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const totalRows = tableData.length; // Assuming tableData is your dataset
  const allRowsValue = 10000;

  const handlePerPageChange = (perPage) => {
    setRowsPerPage(perPage === allRowsValue ? totalRows : perPage);
  };

  // Pagination options including 'All'
  const paginationOptions = {
    rowsPerPageOptions: [5, 10, 20, 50, 100, allRowsValue],
    rowsPerPageText: (perPage) => perPage === allRowsValue ? 'All' : perPage.toString(),
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All'
  };









  useEffect(() => {
    if (detailData && detailData.length > 0) {
      const detailQueryIds = detailData.map(item => item.rank.query_id);
      console.log(detailQueryIds)
      const newFilteredData = tableData.filter(item => detailQueryIds.includes(item.query_id));

      console.log(newFilteredData)
      setIsFolderSelected(true)
      setFilteredData(newFilteredData);
    } else {
      // Fall back to the original data or any other default state
      setFilteredData(tableData);
    }
  }, [detailData, tableData]);

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Only reset to tableData if no folder is selected
    if (!isFolderSelected) {
      setFilteredData(tableData);
    }
  }, [tableData, isFolderSelected]);


  const handleResetFilter = () => {
    dispatch(resetFavorites()); // Reset the favorites data in the global state

    setFilteredData(tableData);
    setIsFolderSelected(false); // Update state to indicate no folder is selected
  };


  const handleBackClick = () => {

    navigate('/projects');

  };


  const [lastSelectedIndex, setLastSelectedIndex] = useState(null); // Track the last selected row's index

  const handleRowInteraction = (row, event, rowIndex) => {
   
    const currentId = row.query_id;

  if (event.shiftKey && lastSelectedIndex !== null) {
    const start = Math.min(lastSelectedIndex, rowIndex);
    const end = Math.max(lastSelectedIndex, rowIndex);
    const rowsInRange = filteredData.slice(start, end + 1);
    const rowIdsInRange = rowsInRange.map(r => r.query_id);

    // Determine if we are selecting or deselecting based on the state of the first clicked row
    const isSelecting = !checkedRows.includes(currentId);

    // Update checkedRows
    let newCheckedRows;
    if (isSelecting) {
      // Add all rowIdsInRange to checkedRows
      newCheckedRows = [...new Set([...checkedRows, ...rowIdsInRange])];
    } else {
      // Remove all rowIdsInRange from checkedRows
      newCheckedRows = checkedRows.filter(id => !rowIdsInRange.includes(id));
    }
    setCheckedRows(newCheckedRows);

    // Update selectedRows similarly
    let newSelectedRows;
    if (isSelecting) {
      // Add all rows in the range to selectedRows
      newSelectedRows = [...new Set([...selectedRows, ...rowsInRange])];
    } else {
      // Remove all rows in the range from selectedRows
      newSelectedRows = selectedRows.filter(selectedRow => !rowIdsInRange.includes(selectedRow.query_id));
    }
    setSelectedRows(newSelectedRows);
    } 
    else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd key is pressed, toggle the row selection
      const isSelected = selectedRows.some(r => r.query_id === currentId);
      const isChecked = checkedRows.includes(currentId);
  
      if (isSelected) {
        setSelectedRows(prevSelectedRows => prevSelectedRows.filter(r => r.query_id !== currentId));
      } else {
        setSelectedRows(prevSelectedRows => [...prevSelectedRows, row]);
      }
  
      // Toggle checked state based on whether it's already checked
      if (isChecked) {
        setCheckedRows(prevCheckedRows => prevCheckedRows.filter(id => id !== currentId));
      } else {
        setCheckedRows(prevCheckedRows => [...prevCheckedRows, currentId]);
      }
    } else {
      // No modifier key is pressed, select only the clicked row
      setSelectedRows([row]);
    }
  
    // Update the lastSelectedIndex with the current row index
    setLastSelectedIndex(rowIndex);
  };

  const handleDragStart = (e) => {
    // Create a "ghost" element to represent the drag image
    const ghostElement = document.createElement('div');
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    ghostElement.textContent = `${selectedRows.length} rows selected`;
    document.body.appendChild(ghostElement);

    // Use the ghost element as the drag image
    e.dataTransfer.setDragImage(ghostElement, 0, 0);

    // Store the selected rows' information in the dataTransfer object
    e.dataTransfer.setData('application/json', JSON.stringify(selectedRows));

    // Cleanup ghost element after a short delay
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };


  // Make sure this function is used in the context of your drag-and-drop setup.
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const displayBookmarkSlice = useSelector((state) => state.displayBookmarkSlice.bookmarks);
  const [expandedBookmarkId, setExpandedBookmarkId] = useState(null);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  // const userId = useSelector((state) => state?.authSlice?.user?.id);

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
      toast.info(`Bookmark "${newBookmarkName}" created successfully`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

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
      toast.info(`Bookmark "${bookmarkToDelete.name}" deleted successfully`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
      setEditingBookmarkId(null);
      toast.info(`Bookmark renamed from "${bookmarkToRename.name}" to "${newName}"`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      toast.error(`Failed to rename bookmark: ${error.message}`);
    }
  };




  const handleDrop = async (event, bookmarkId) => {
    event.preventDefault();
    const draggedDataString = event.dataTransfer.getData("application/json");
    if (!draggedDataString) {
      console.error("Dropped data is empty");
      toast.error("Dropped data is empty");
      return;
    }

    // Parse the dragged data
    const draggedItems = JSON.parse(draggedDataString);

    // Prepare for checking and updating the state
    let newFavorites = [];
    let successCount = 0; // Counter for successfully created favorites

    for (const item of draggedItems) {
      // Construct the API URL for adding a favorite
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${encodeURIComponent(item.query)}/${encodeURIComponent(item.target_url)}/${encodeURIComponent(item.google_domain)}/${bookmarkId}/`;

      try {
        // Check if the item already exists in the folder to prevent repetition
        const itemExists = favorites.some(favorite => favorite.query === item.query && favorite.bookmarkId === bookmarkId);

        if (!itemExists) {
          // If the item does not exist, proceed with the API request to add it
          const response = await axios.get(apiUrl); // Adjust according to your API's method (GET/POST)

          if (response.status === 200 || response.status === 201) {
            // Update the state with the new favorite
            newFavorites.push({
              ...item,
              bookmarkId: bookmarkId, // Ensure this matches your state structure
              favoriteId: response.data.favoriteId // Or however you get the new ID
            });
            successCount++;
            // toast.info(`Favorite created: ${item.query}`);
          } else {
            console.error("Failed to create favorite", response);
            // toast.error(`Failed to create favorite: ${item.query}`);
          }
        }
      } catch (error) {
        console.error("Error creating favorite", error);
        // toast.error(`Error creating favorite: ${item.query}`);
      }
    }

    // Update the state with new favorites if any were added
    if (newFavorites.length > 0) {
      setFavorites(existingFavorites => [...existingFavorites, ...newFavorites]);
      toast.success(`${successCount} ${successCount === 1 ? 'item' : 'items'} added to bookmark successfully`);
    }
  };
  useEffect(() => {
    const sortData = (data) => {
      if (!sortConfig.key) return data; // No sort applied
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    };

    // Apply sorting
    const sortedData = sortData(tableData);

    // Then set the sorted data
    setFilteredData(sortedData);
  }, [tableData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }
/*checked rows*/
  const [checkedRows, setCheckedRows] = useState([]);
  const handleSelectChange = (e, query_id) => {
    if (e.target.checked) {
      setCheckedRows((prev) => [...prev, query_id]);
    } else {
      setCheckedRows((prev) => prev.filter((id) => id !== query_id));
    }
  };
  const handleDeleteChecked = () => {
    // Logic now using checkedRows
    setCheckedRows([]); // Clear selections after action
  };
  const isAllSelected = () => {
    return currentRows.length > 0 && checkedRows.length === currentRows.length;
  };
  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      // Select all rows
      const allRowIds = currentRows.map((row) => row.query_id);
      setCheckedRows(allRowIds);
    } else {
      // Deselect all rows
      setCheckedRows([]);
    }
  };
    // State for storing the selected bulk action
const [selectedBulkAction, setSelectedBulkAction] = useState("");
// Assuming you already have state for bookmarks
const [selectedBookmarkForAdding, setSelectedBookmarkForAdding] = useState(null);

const handleBulkAction = async (action) => {

  setSelectedBulkAction(action);

  switch (action) {
    case "update":
      await  handleBulkUpdate(userId, projectId);


      break;
    case "delete":
      checkedRows.forEach((queryId) => {
        handleDeleteButtonClick(queryId);
      });
      break;
      case "add":
       setShowBookmarkSelector(true);
        break;
    default:
      console.log("No action selected");
  }


};



const handleCheckboxChange = (queryId, isChecked) => {
  setCheckedRows(current => {
    if (isChecked) {
      return [...current, queryId];
    } else {
      return current.filter(id => id !== queryId);
    }
  });
};

// const handleAddToBookmark = async (bookmarkId) => {
//   console.log("Hellodnnnhd")
//   console.log("Adding to bookmarkId:", bookmarkId); // To check if the function is called with correct bookmarkId
//   for (const queryId of checkedRows) {
//     const queryDetails = filteredData.find((q) => q.query_id === queryId);
//     console.log(queryDetails)
//     if (!queryDetails) {
//       console.warn(`Details not found for query ID: ${queryId}`);
//       continue;
//     }

//     console.log("Adding to bookmark:", queryDetails); // Log to see the query details

//     try {
//       const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${encodeURIComponent(queryDetails.query)}/${encodeURIComponent(queryDetails.target_url)}/${encodeURIComponent(queryDetails.google_domain)}/${bookmarkId}/`;
//       console.log(apiUrl)
//       const response = await axios.post(apiUrl); // Assuming POST request with no body or adjust as per your API requirement

//       if (response.status === 200 || response.status === 201) {
//         console.log(`Successfully added '${queryDetails.query}' to bookmark ${bookmarkId}`);
//       } else {
//         console.error(`Failed to add '${queryDetails.query}' to bookmark ${bookmarkId}`);
//       }
//     } catch (error) {
//       console.error(`Error adding '${queryDetails.query}' to bookmark ${bookmarkId}:`, error);
//     }
//   }

//   setShowBookmarkSelector(false); // Hide the bookmark selector after operation
//   setCheckedRows([]); // Reset selected queries after adding to bookmark
// };


const handleAddToBookmark = async (bookmarkId) => {
console.log(showBookmarkSelector)
  let successCount = 0; // Initialize a counter for successful additions

  for (const queryId of checkedRows) {
    const queryDetails = filteredData.find((q) => q.query_id === queryId);
    if (!queryDetails) {
      console.warn(`Details not found for query ID: ${queryId}`);
      continue;
    }

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${encodeURIComponent(queryDetails.query)}/${encodeURIComponent(queryDetails.target_url)}/${encodeURIComponent(queryDetails.google_domain)}/${bookmarkId}/`;
      const response = await axios.get(apiUrl);

      if (response.status === 200 || response.status === 201) {
        successCount++; // Increment the counter for each successful addition
      } else {
        // Handle the case where the API call was not successful
        console.warn(`Failed to add '${queryDetails.query}' to bookmark ${bookmarkId}`);
      }
    } catch (error) {
      console.error(`Error adding '${queryDetails.query}' to bookmark ${bookmarkId}:`, error);
      // Optionally: Show an error message or handle the error as needed
    }
  }

  setShowBookmarkSelector(false); 

  // Check if there were any successful additions and show a summary toast
  if (successCount > 0) {
    toast.success(`${successCount} ${successCount === 1 ? 'query was' : 'queries were'} successfully added to the bookmark`);
  } else {
    // If no queries were successfully added, you might want to inform the user as well
    toast.info('No queries were added to the bookmark');
  }

  setCheckedRows([]); // Reset the selection after the operation
};

const [selectedOption, setSelectedOption] = useState(null);
const options = [
  { value: 'update', label: 'Update query' },
  { value: 'delete', label: 'Delete qery' },
  { value: 'add', label: 'Add to Bookamrk', submenu: displayBookmarkSlice },

];

const [selectedMainOption, setSelectedMainOption] = useState(null);
const [showMainOptions, setShowMainOptions] = useState(false);

const handleChange = (selectedOption) => {
  setSelectedOption(selectedOption);
  if (selectedOption.value === 'add') {
    setShowBookmarkSelector(true); // Show submenu for adding bookmarks
  } else {
    setShowBookmarkSelector(false); // Hide submenu if not Add option
    handleBulkAction(selectedOption.value);
  }
};
const handleMainOptionClick = (option) => {
  setSelectedMainOption(option);
  if (option.submenu) {
    setShowBookmarkSelector(true); // Assuming this shows the bookmarks submenu
  } else {
    // Handle other actions directly here
    handleBulkAction(option.value);
  }
  setShowMainOptions(false); // Hide the main options menu after selection
};



const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: 2,
    borderColor: state.isFocused ? 'gray' : 'gray',
    boxShadow: state.isFocused ? '0 0 0 1px gray' : 'none',
    '&:hover': { borderColor: 'lightgray' },
    zIndex: state.isFocused ? '5' : '1', 
    width:'450px'
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'gray',
    padding: 10,
    
  })
};

// const handleChange = (selectedOption) => {
//   setSelectedOption(selectedOption);
//   handleBulkAction(selectedOption.value);
// };

const bookmarkSelectorRef = useRef(null);
const closeBookmarkSelector = () => {
  setShowBookmarkSelector(false);
  console.log(showBookmarkSelector)
};



// Use the hook
useOutsideClick(bookmarkSelectorRef, closeBookmarkSelector);
  return (
    <>




      {isPopupVisible && (
        <Transition.Root
          show={isModal_Open}
          as={Fragment}>
          <Dialog as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={close_Modal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-0" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                    {isModal_Open && (


                      <div className="px-10 py-[70px]">
                        <div

                          className="bg-blue/20 border-b rounded-none border-blue
      shadow-none z-[10] p-2 mb-2 text-center"


                        >
                          <h1 className='font-semibold'>Single or Bulk keyword</h1>
                        </div>

                        <div>


                          <form onSubmit={handleSubmit(onBulkSubmit)}>
                            <textarea
                              {...register("keywords")}
                              placeholder="Enter Single or Bulk keywords"
                              className="w-full p-2 mt-1 border-b"
                            />

                            <div className='flex justify-between space-x-4'>

                              <input

                                {...register("url")}
                                className="w-full p-2 mt-1 border-b"
                              />

                              <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    components={animatedComponents}
                                    options={locationOptions}
                                    value={selectedLocation}

                                    onChange={handleLocationChange}

                                    className="w-[100%] mt-3"
                                    styles={{
                                      option: (provided) => ({
                                        ...provided,
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px 8px',
                                      }),
                                      singleValue: (provided) => ({
                                        ...provided,
                                        display: 'flex',
                                        alignItems: 'center',
                                      }),
                                      valueContainer: (provided) => ({
                                        ...provided,
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1px',
                                        marginLeft: '4px',
                                      }),
                                    }}
                                    isSearchable={false}
                                    getOptionLabel={(option) => (
                                      <>
                                        {
                                          option.icon && <span className="w-6 mr-2">{option.icon}</span>}
                                        {option.label}
                                      </>
                                    )}
                                    getOptionValue={(option) => option.value}
                                  />
                                )}
                              />

                            </div>
                            {errors.url && <p className="text-red-500">{errors.url.message}</p>}

                            <button
                              type="submit"
                              className={`px-4 py-2 rounded w-full mt-4 font-semibold 
${isDataLoading ? 'bg-gray-200 text-slate-800 cursor-not-allowed' : 'bg-blue text-white'}`}
                              disabled={isDataLoading}
                            >
                              Submit Keywords
                            </button>


                          </form>

                        </div>
                      </div>
                    )}


                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}


      <div className="w-[100%]  p-4 mt-[4rem] ">


        <div>


          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 m-auto  w-[100%]
  animate-fade-in-down'>
            <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105' onClick={handleBackClick}>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize' >Back to all projects</span>

              </div>
              <FaArrowLeft className='mb-2 text-4xl text-blue ' />
            </div>

            <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize'>project</span>
                {/* <p className='font-bold capitalize text-md text-greeng'>{projectDetails.name}</p> */}
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.name}</p>

              </div>
              <FaRegFileAlt className='mb-2 text-4xl text-blue ' />

            </div>


            <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>Url</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.url}</p>
              </div>
              <FaLink className='mb-2 text-4xl text-blue' />

            </div>

            <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>ID</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.project_id}</p>
              </div>
              <FaRegIdBadge className='mb-2 text-4xl text-blue' />

            </div>

            <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>Created at</span>
                <p className='font-bold text-md text-greeng'>
                  {projectDetails?.created_at ? new Date(projectDetails.created_at).toISOString().split('T')[0] : 'N/A'}
                </p>

              </div>
              <FaRegCalendarAlt className='mb-2 text-4xl text-blue' />

            </div>
          </div>


        </div>




        <div className="flex mb-4 -mx-2">

          <SearchBar handleSearchInputChange={handleSearchInputChange} searchQuery={searchQuery} />

          <div className="p-4 w-full md:w-[28.33%] px-2 z-[10000]">
            <label className="block mt-3 mb-1 text-lg">Filter by Target URL</label>
            <Select
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={uniqueTargetUrls.map((url) => ({ value: url, label: url }))}
              value={{ value: selectedTargetUrl, label: selectedTargetUrl }}
              onChange={handleTargetUrlFilterChange}
              className="w-full"
            />
          </div>



          <div className="p-4 w-full md:w-[28.33%] px-2">
            <label className="block text-lg  mt-3 mb-[3px]">Filter by Location</label>
            <LocationFilter
              selectedLocationFilter={selectedLocationFilter}
              setSelectedLocationFilter={setSelectedLocationFilter}
            />
          </div>

          <div className="p-4 w-full md:w-[15%] px-2"
            onMouseEnter={handleMouseEnter}
            onClick={open_Modal}
            onMouseLeave={handleMouseLeave}>

            <h3 className="block text-lg  mt-3 mb-[3px] opacity-0"> Query{" "}
            </h3>
            <button
              onClick={open_Modal}
              className="w-full flex items-center justify-center mr-2  bg-blue h-[38px] 
text-white p-3 rounded transition duration-150 ease-in-out lg:text-sm text-xs font-bold"
            >
              <span className='flex space-x-2 '>

                <FaPlus className="text-white lg:mr-2 " />
                <p className='inline font-semibold text-white lg-plus:hidden '>Query</p>
              </span>
              <span className="hidden text-white lg-plus:inline">Add New Query</span>
            </button>

          </div>
        </div>
        <div className='flex justify-between w-[78%] space-x-[50px]'> {/* Adjust the gap as needed */}
      <div>

      <div className='flex flex-col space-y-3'>


  <div className='flex space-x-3'>
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      styles={customStyles}
      placeholder="Select Action"
      isSearchable={false}
    />
    <button
      onClick={() => setShowMainOptions(true)}
      className={`w-[200px] text-white bg-blue rounded`}
    >
      Go
    </button>

    

    {showBookmarkSelector && (
      <div
      ref={bookmarksRef} 
       className={`absolute left-[5px]  z-50 mt-[50px] bg-white rounded-md w-[450px] border border-gray-300`}>
        <div className="py-1">
          {displayBookmarkSlice.map((bookmark, index) => (
            <div 
              key={bookmark.id}
              className={`block w-full p-2 text-sm text-left 
              ${index !== displayBookmarkSlice.length - 1 ? 'border-b' : ''} cursor-pointer hover:bg-gray-200`}
              onClick={() => handleAddToBookmark(bookmark.b_id)}
            >
              {bookmark.name}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>



</div>




  </div>
  
<div>
{selectedTargetUrl && (
    <div className="font-bold">
      <h3>Selected Target URL:
        <span className="ml-2 text-blue-600">{selectedTargetUrl.label || selectedTargetUrl}</span>
      </h3>
    </div>
  )}
</div>
</div>


        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
              <ClipLoader size={100} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          </div>

        ) : (
          <div className="flex justify-between p-0 mt-4 border-t-2 border-gray-200 spac lg-plus:p-4">





            <div className={`moo     p-4 ${isSidebarOpen ? 'w-[80%] ' : 'w-[100%]'}`}>





              {!operationsCompleted && (
                <div className='addUpdateBox fixed bottom-[10px] right-[10px] z-[1000] p-4 w-[18%] lg-plus:w-[15%] bg-white border-2 border-gray-200 rounded-lg'>
                  {/* Your progress bars and messages */}
                  {showProgressBar && (
                    <div className='font-semibold mt-[5px] rounded-md z-[1000] bg-white'>
                      {renderSharedProgressBar()}
                      <div className='mt-2'>
                        Updated {completedUpdates} of {totalUpdates} queries
                        {updateErrors > 0 && <span className="ml-2 text-red-500">, with {updateErrors} error(s)</span>}
                      </div>
                    </div>
                  )}


                  {showAddProgressBar && (
                    <>
                      <div className='z-[1000] bg-white'>
                        <AddProgressBar />
                        <div className='mt-2'>
                          Added {completedAdds} of {totalAdds} queries
                          {addErrors > 0 && <span className="ml-2 text-red-500">, with {addErrors} error(s)</span>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}


              <div className="flex justify-between ">
                {isFolderSelected && (
                  <button
                    onClick={handleResetFilter}
                    className="px-4 py-2 mb-2 text-white transition duration-200 ease-in bg-blue-500 rounded bg-blue hover:bg-blue"
                  >
                    Back to All Data
                  </button>
                )}
                {isFolderSelected && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Selected Bookmark: {selectedBookmarkName}</h3>
                  </div>
                )}
              </div>
              <div className='border-2 border-gray-200 rounded-lg table-parent '>
                <table ref={tableRef} className="min-w-full divide-y divide-gray-200 ">
                  <thead className=" bg-gray-50">

                    <tr
                    >
                      
                          <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase sticky-col-head">
  <input
    type="checkbox"
    onChange={handleSelectAllClick}
    checked={isAllSelected()}
  />


                        </th>
                    

                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('query')}>
                        <span className='inline'>keywords </span> 
                        {sortConfig.key === 'query' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline'/>  :<FaArrowDown className='inline'/>  ) : ''}

                      </th>


                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('rank')}>
                      <span className='inline'>Rank  </span> 
                       
                        {sortConfig.key === 'rank' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline'/>  :<FaArrowDown className='inline'/>  ) : ''}
                      </th>

                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('best_rank')}>
                      <span className='inline'>Best Rank  </span> 
                      {sortConfig.key === 'best_rank' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline'/>  :<FaArrowDown className='inline'/>  )  : ''}
                      </th>
                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('date')}>
                      <span className='inline'>Date </span> 

                         {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline'/>  :<FaArrowDown className='inline'/>  ) : ''}
                      </th>
                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('google_domain')}>
                      <span className='inline'>Location </span> 

                       {sortConfig.key === 'google_domain' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline'/>  :<FaArrowDown className='inline'/>  )  : ''}
                      </th>

                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('source_url')}>
                      <span className='inline'>Origin </span> 

                        {sortConfig.key === 'source_url' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline'/>  :<FaArrowDown className='inline'/>  ) : ''}

                      </th>

                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase sticky-right-head">
                      </th>

                    </tr>
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-gray-200">
                    {currentRows.length > 0 ? (
                      currentRows.map((row, index) => (
                        <>
                          <tr
                              onClick={(event) => handleRowInteraction(row, event, index)}

                        //  onclick ={() => handleRowClick(row.query_id)}
                            key={row.query_id}
                            className={`hover:bg-[#f3f4f6]   
                          cursor-pointer 
                           ${selectedRows.includes(row) ? 'bg-[#e2e8f0]' : ''}`}
                            //  onClick={(event) => handleSelectRow(row, event, index)}

                            onMouseDown={(e) => handleRowClick(e, row.query_id)}
                            draggable={selectedRows.includes(row)}
                            onDragStart={handleDragStart}
                          >
                            <td className="px-6 py-4 sticky-col whitespace-nowrap">
                            <input
  type="checkbox"
  checked={checkedRows.includes(row.query_id)}
  onChange={(e) => handleSelectChange(e, row.query_id)}
/>

</td>

<td
  className="whitespace-nowrap"
  onMouseEnter={() => row.query.length > 15 ? setHoveredRowId(row.query_id) : null}
  onMouseLeave={() => setHoveredRowId(null)}
>
  {truncateText(row.query)}
  {hoveredRowId === row.query_id && (
    <div 
      className="relative  z-10 p-2 mt-1 text-sm text-white w-[70%] bg-black rounded-md"
      style={{ left: '0%', bottom: '-30%' }}
    >
      {row.query}
    </div>
  )}
</td>


                            <td className="relative whitespace-nowrap">
                              {row.rank === 101 ? '-' : row.rank}
                              {row.rank_difference != null && row.rank_difference != 0 && (
                                <span
                                  className={`absolute top-[5px] left-[70px] text-sm font-bold ${row.rank_difference > 0 ? 'text-green-500' : 'text-red-500'
                                    }`}
                                >
                                  {row.rank_difference > 0 ? `+${row.rank_difference}` : row.rank_difference}
                                </span>
                              )}



                            </td>



                            <td className=" whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <span className="flex items-center">
                                  {row.best_rank === 101 ? '-' : row.best_rank}
                                </span>
                              </div>
                            </td>

                            <td className=" whitespace-nowrap">
                              {formattedDate(row.date)}
                            </td>
                            <td className="flex items-center justify-center mt-3 whitespace-nowrap">
                              <img src={locationImages[row.google_domain]} alt={row.google_domain} className="w-6" />
                            </td>
                            <td className=" whitespace-nowrap">
                              {
                                row.temp ? (
                                  <div className="text-center">Loading...</div>
                                ) : row.noDataIndicator || !row.source_url || typeof row.source_url !== 'string' ? (
                                  null // No data or invalid URL
                                ) : /[\u0600-\u06FF]/.test(row.source_url) ? (
                                  // If the URL contains Arabic characters
                                  <div>Arabic URL: {row.source_url}</div>
                                ) : (
                                  // For URLs without Arabic characters
                                  (() => {
                                    const regex = /\/([^\/]*)\/?$/;
                                    const matches = row.source_url.match(regex);
                                    const lastSegment = matches && matches[1] ? decodeURIComponent(matches[1]) : '';
                                    return lastSegment ? (
                                      <div className="tooltip-container ">
                                        <span className="tooltip-text ">{decodeURIComponent(row.source_url)}</span>
                                        <br />
                                        <a href={row.source_url} target="_blank" rel="noopener noreferrer">{lastSegment}</a>
                                      </div>
                                    ) : (
                                      <div>URL NOT FOUND.</div>
                                    );
                                  })()
                                )
                              }

                            </td>
                            <td className="relative whitespace-nowrap sticky-right ">
                              <div className='flex mx-auto border-l-2 h-[100%]'>
                                <Menu as="div" className="relative flex flex-col justify-center transition-all duration-300 ease-in-out p-3tex"
                                 onMouseDown={() => toggleDropdown(row.query_id)}>
                                  <Menu.Button >
                                    <BiDotsVertical size={18} className='m-3 rounded-full cursor-pointer hover:bg-gray-300 ' />
                                  </Menu.Button>


                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <Menu.Items className="absolute top-[-30px] 
    z-10 p-2 right-[32px]  w-[110px]
    bg-white rounded-lg shadowmenu">

                                      {/* Update Button */}
                                      <Menu.Item>
  {({ active }) => (
    <div className=''>
      <button
        onClick={(e) => handleUpdateButtonClick(e, userId, row.query_id, row.project)}
        className={`rounded-lg flex items-center ${updatingRows[row.query_id] ? 'cursor-not-allowed' : ''}`}
        disabled={updatingRows[row.query_id]} // Disable the button when updatingRows for this query_id is true
      >
        {updatingRows[row.query_id] ? (
          <ClipLoader size={12} color={'green'} loading={true} />
        ) : (
          <ImSpinner11 className="mr-2 hover:text-blue-600" />
        )}
        <span className='ml-[5px] text-sm'>Update</span>
      </button>
    </div>
  )}
</Menu.Item>


                                      {/* Delete Button */}
                                      <Menu.Item>
                                        {({ active }) => (
                                          <div className='py-2'>


                                            <button
                                              onClick={() => handleDeleteButtonClick(row.query_id)}
                                              className="flex items-center justify-around rounded-lg "
                                            >
                                              <FaTrash className="mr-2 hover:text-blue-600" />
                                              <span className=' ml-[5px]  text-sm'>  Delete</span>

                                            </button>

                                          </div>
                                        )}
                                      </Menu.Item>

                                      {/* View Button */}
                                      <Menu.Item>
                                        {({ active }) => (
                                          <div className=''>


                                            <Link className='flex items-center rounded-lg text-slate-500'
                                              to={`/details/${userId}/${row.query_id}/${projectId}`}>
                                              <FaArrowsToEye className="mr-2 hover:text-blue-600" />
                                              <span className=' text-sm ml-[5px]'>View &nbsp;</span>
                                            </Link>

                                          </div>
                                        )}
                                      </Menu.Item>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                            </td>


                          </tr>
                          {expandedRowId === row.query_id && (
                            <tr>
                              <td colSpan="100%">
                                <TabsProjects
                                  rowData={row}
                                  projectId={projectId}
                                />
                              </td>
                            </tr>
                          )}
                        </>


                      ))
                    ) : isFolderSelected ? (
                      // Display this message if a bookmark is selected but no data is found
                      <tr>
                        <td colSpan="100%" className="px-6 py-4 text-center text-gray-500 whitespace-nowrap">
                          No data found for the selected bookmark.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="100%" className="px-6 py-4 text-center text-gray-500 whitespace-nowrap">
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div>

                <div className="flex justify-between mt-4">
                  <div className="flex justify-between">
                    {/* <label htmlFor="rows-per-page" className="mr-2 text-sm font-medium text-gray-700">Rows per page:</label> */}
                    <select
                      id="rows-per-page"
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {[5, 10, 15, 20, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                      <option value={tableData.length}>All</option>
                    </select>
                  </div>

                  <nav aria-label="Page navigation">
                    <ul className="inline-flex items-center -space-x-px">
                      <li>
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l hover:bg-blue-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                            }`}
                          aria-label="Previous"
                        >
                          <span aria-hidden="true">&laquo;</span>
                        </button>
                      </li>
                      <li>
                        <span className="px-4 py-2 text-gray-700 bg-white border-t border-b border-gray-300">
                          {currentPage}
                        </span>
                      </li>
                      <li>
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}
                          className={`px-4 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r hover:bg-blue-100 ${currentPage === Math.ceil(tableData.length / rowsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                            }`}
                          aria-label="Next"
                        >
                          <span aria-hidden="true">&raquo;</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                  <div className=''>
                    <span className='font-bold'>
                      Total Rows:
                    </span> {tableData.length}
                  </div>

                </div>


              </div>
              {isFolderSelected && (
                <BookmarkDetails bookmarkId={selectedBookmarkId} />

              )}

            </div>
            {isSidebarOpen &&
              <div className={`relative  lg-plus:z-[99] z-[99999]   rounded-[10px] p-4 w-[20]`}
              >
                {/* ${isSidebarOpen ? 'w-[30%] lg-plus:w-[20%]' : ''} p-4`} */}
                <div
                  // ref={sidebarRef}
                  className={`overflow-hidden right-[1px] h-[50vh] p-5 rounded-lg
                border-2 border-gray-200 bg-white
                
                 stickySidebar `
                  }

                >

                  <div className="relative w-full z-[9999]  sidebar-animation">
                    <div className="relative search-container ">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchBookmark}
                        onChange={handleSearchBookmark}
                        className="w-full py-2 pl-10 pr-4 mt-4 font-semibold border rounded-full search-input"
                      />
                      <div className="search-icon absolute left-3 top-[65%] transform -translate-y-1/2">
                        <FiSearch className="text-gray-700" size={16} />
                      </div>
                    </div>

                    <div className=" rounded z-[10000] mt-4 listtest">

                      <div className="flex justify-between mb-2">
                        <div className="relative flex-grow">
                          <input
                            type="text"
                            placeholder="Bookmark..."
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

                            <div
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, bookmark.b_id)}
                              className="flex items-center justify-between p-2 text-black bg-white rounded-md cursor-pointer hover:bg-blue-100">

                              <button
                                className="flex items-center flex-grow">


                                <div className='flex items-center justify-center'>
                                  <FaFolder className="mr-2 text-blue" />
                                  {editingBookmarkId === bookmark.b_id ? (
                                    <input
                                      value={bookmarkNames[bookmark.b_id] ?? bookmark.name}
                                      onChange={(e) => setBookmarkNames({ ...bookmarkNames, [bookmark.b_id]: e.target.value })}
                                      className="flex-grow font-semibold text-gray-700"
                                      autoFocus
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleRenameBookmark(bookmark.b_id, bookmarkNames[bookmark.b_id] ?? bookmark.name);
                                        }
                                      }}
                                      onBlur={() => setEditingBookmarkId(null)}
                                    />
                                  ) : (
                                    <span
                                      onClick={() => handleBookmarkClick(bookmark)}

                                      className="flex-grow font-semibold text-gray-700 cursor-pointer"
                                    >
                                      {bookmark.name}
                                    </span>
                                  )}
                                </div>



                              </button>
                              <div className='flex items-center '>


                                <p className="mr-2 text-gray-500 whitespace-nowrap">
                                  {/* [ {roundedAverageRank} ] */}
                                  <span className="ml-2 text-sm font-semibold"> {bookmark.averageRank}</span>

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
                                            <button
                                              onClick={() => {
                                                setEditingBookmarkId(bookmark.b_id);
                                                setBookmarkNames(prev => ({ ...prev, [bookmark.b_id]: bookmark.name }));
                                              }}
                                              className={`'text-gray-900'} group flex items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                              <FaEdit className={`mr-2`} aria-hidden="true" />
                                              Rename
                                            </button>
                                          )}
                                        </Menu.Item>

                                        <Menu.Item>
                                          {({ active }) => (
                                            <button onClick={() => handleDeleteBookmark(userId, bookmark.b_id)}
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
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            }







          </div>
        )}
      </div>

    </>
  );
};

export default Projectranks;




