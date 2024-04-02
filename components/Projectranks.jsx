import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import ClipLoader from "react-spinners/ClipLoader";
import { ImSpinner11 } from "react-icons/im";
import * as XLSX from 'xlsx';
import {
  FaCopy,
  FaRegCopy,
  FaChevronDown,
  FaFolder, FaEdit, FaArrowUp, FaArrowDown,
  FaChevronUp, 
} from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

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
import { FaTrash ,FaBookmark} from "react-icons/fa";
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
import Confirmation from './Modal/Confirmation';
import ConfirmationDialog from './Modal/ConfirmingDialog';
import ConfirmationUpdate from './Modal/ConfirmationUpdate';
import { locationOptions } from '../location';
import ReactApexChart from 'react-apexcharts';
import RankRange from './RankRange';
import RankRangeSlider from './RankRangeSlider';

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
  const [selectedOption, setSelectedOption] = useState(null);
  const [updateErrors, setUpdateErrors] = useState(0);
  const [totalUpdates, setTotalUpdates] = useState(0);
  const [completedUpdates, setCompletedUpdates] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(true); // New state
  const [fadeOut, setFadeOut] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const isSidebarOpen = useSelector((state) => state.SidebarSlice.isOpen);
  const [searchBookmark, setSearchBookmark] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showBookmarkSelector, setShowBookmarkSelector] = useState(false);
  const [show_BookmarkSelector, setShow_BookmarkSelector] = useState(false);

  const toggleBookmarkSelector = () => {
    setShow_BookmarkSelector((prevShow) => !prevShow);
  };
  const [showTooltip, setShowTooltip] = useState(false);
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


  const [queryName, setQueryName] = useState("");

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
  const [isEditInProgress, setIsEditInProgress] = useState(false);

  // const operationsCompleted = !showAddProgressBar && !showProgressBar;
  const operationsCompleted = !(showProgressBar || isEditInProgress || showAddProgressBar);

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
    resetSelections(); // Reset selections when a bookmark is clicked

  };





  const tableData = useSelector((state) => state.tableSlice.data);
console.log(tableData)
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


  const bookmarkPagination = (
    <nav aria-label="Bookmark Page navigation">
      {/* Similar structure as the mainPagination but use state related to the bookmark's data */}
    </nav>
  );
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
  }, []);

  const [operationCompleted, setOperationCompleted] = useState(false);

  
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


  // const locationOptions = [
  //   { value: 'All Locations', label: 'All Locations' },
  //   { value: 'US', label: 'USA', icon: <img src={USA} alt="USA" /> },
  //   { value: 'EG', label: 'Egypt', icon: <img src={EGYPT} alt="Egypt" /> },
  //   { value: 'AE', label: 'Dubai', icon: <img src={AE} alt="Dubai" /> },
  // ];

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingQueryId, setDeletingQueryId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // State t
  const confirmDeletion = async () => {
    if (!deletingQueryId) return; // Guard clause in case deletingQueryId is null

    setIsDeleting(true); // Indicate that deletion is in progress
    try {
      await dispatch(deleteProject(deletingQueryId)).unwrap();
      setFilteredData(currentData => currentData.filter(rank => rank.query_id !== deletingQueryId));
      toast.info('Rank deleted successfully');
    } catch (error) {
      console.error('Error deleting rank:', error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDialogOpen(false); // Close the dialog regardless of the outcome
      setDeletingQueryId(null); // Reset the deletingQueryId
      setIsDeleting(false); // Reset the deletion indicator
    }
  };

  const cancelDeletion = () => {
    setIsDialogOpen(false);
    setDeletingQueryId(null);
  };
  const handleDeleteButtonClick = (query_id) => {
    setDeletingQueryId(query_id);
    setIsDialogOpen(true);

  };
  const handleBulkDelete = () => {
    if (checkedRows.length === 0) {
      toast.info('No queries selected for deletion.');
      return;
    }
    
    // Loop through all checkedRows and call handleDeleteButtonClick for each
    checkedRows.forEach((query_id) => {
      handleDeleteButtonClick(query_id);
    });
  };

  // Adjust your delete button to use the new handler
  
  const handleUpdateButton_Click = async (event, userId, query_id, project_id) => {

    event.stopPropagation();

    setTotalUpdates(prev => prev + 1);
    setShowProgressBar(true);

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
          setCompletedUpdates(prev => prev + 1);

          toast.success(`${response.data.query} update successful`);

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
  // Example function to call the update API
  const handleUpdateQuery = async (userId, queryId, projectId, updatedData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/UpdateNewQuery/${userId}/${queryId}/${projectId}/`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // if (response.status === 200) {
      //   // Update local state or re-fetch data to reflect the changes
      //   toast.success('Query updated successfully');
      // } else {
      //   toast.error('Failed to update the query.');
      // }
    } catch (error) {
      console.error('Error updating query:', error);
      toast.error('An error occurred while updating the query.');
    }
  };



  const handleUpdateButtonClick = async (event, userId, query_id, project_id) => {

    event.stopPropagation();

    //  setTotalUpdates(prev => prev + 1); 
    setShowProgressBar(true);

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
          setCompletedUpdates(prev => prev + 1);

          toast.success(`${response.data.query} update successful`);

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
  const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = useState(false);
  const [bulkUpdateQueries, setBulkUpdateQueries] = useState([]);





  // Function to cancel the bulk update
  const cancelBulkUpdate = () => {
    setIsBulkUpdateDialogOpen(false); // Close the dialog
    console.log("Bulk update cancelled.");
  };



  const handleBulkUpdate = async () => {
    setIsUpdating(true);
    setOperationCompleted(false);
    const updateItems = checkedRows;
    const total = updateItems.length;
    console.log(total)
    setIsUpdateInProgress(true);

    if (!userId || !projectId || checkedRows.length === 0) {
      console.error("Missing userId, projectId, or no rows selected for bulk update.");
      return;
    }

    setTotalUpdates(total); // Set the total number of updates for the bulk operation
    setShowProgressBar(true);

    for (const queryId of updateItems) {
      try {
        // Trigger each update operation
        await handleUpdateButtonClick({ stopPropagation: () => { } }, userId, queryId, projectId);
      } catch (error) {
        console.error(`Update failed for ${queryId}:`, error);
      }
    }
    setIsUpdating(false);
    setOperationCompleted(true);
    setIsUpdateInProgress(false);
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
    console.log(data)
    setIsDataLoading(true);
    close_Modal();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsAdding(true);
    const currentUrl = data.url;
    const newQuery =data.keywords;


    reset({
      keywords: '',
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
      new_query: newQuery,
      target_url: domainName,
      google_domain: selectedLocation?.value,
      temp: true,
      date: currentDate,
      rank: 'Loading...',
      best_rank: 'Loading...',
      origin: 'Loading...',
    }));
    console.log(tempKeywordData)

    setFilteredData(currentData => [...tempKeywordData, ...currentData]);

    for (const query of queries) {
      // await retryRequest(query, data.url, selectedLocation?.value);
      await retryRequest(query, data.url, selectedLocation?.value, isFolderSelected ? selectedBookmarkId : null);

    }

    setIsSubmitting(false);
    setIsAdding(false);
    setIsDataLoading(false);
    setHasSubmitted(true);
  };
  const addQueryToBookmark = async (queryId, bookmarkId) => {
    try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${queryId}/${bookmarkId}/${projectId}/`;
        // Change from axios.post to axios.put if PUT is the correct method
        const response = await axios.get(apiUrl, {
            // Your request payload here
        });
console.log(response)
        // Handle the response
        if (response.status === 201) {
            toast.success("Query added to bookmark successfully!");
            dispatch(fetchData({ userId, projectId }))


        } else {
            console.error("Failed to add query to bookmark: ", response);
            toast.error("Failed to add query to bookmark.");
        }
    } catch (error) {
        console.error("Error adding query to bookmark:", error);
        toast.error("An error occurred while adding the query to the bookmark.");
    }
};



  const retryRequest = async (query, targetUrl, googleDomain) => {

    const retryLimit = 9999999;
    let attempt = 0;
    let requestSuccessful = false;
    const bookmarkId = isFolderSelected ? selectedBookmarkId : null;
    while (attempt < retryLimit && !requestSuccessful) {
      try {
        const response = await dispatch(addKeyword({
          keywordData: { query, target_url: targetUrl, google_domain: googleDomain },
          userId,
          projectId
        })).unwrap();
        const queryId = response[0][0].query_id;
        console.log('Thisis book query', bookmarkId)
        console.log('Thisis book queryID', queryId)

        if (bookmarkId && response) {
          console.log('heelo')
          await addQueryToBookmark(queryId, bookmarkId);

        };

        if (response && Array.isArray(response) && response.length > 0) {
          // Handle successful request
          const rankData = response[0][0];
          
          console.log(rankData)
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
      const newData = currentData.map(item => {
        if (item.temp && item.new_query === query) {
          return {
            ...item,
            ...rankData,
            best_rank:rankData.rank, // Use existing rank if undefined
            temp: false // Indicate this item is no longer loading
          };
        }
        return item;
      });
  
      // Filter out any remaining temp items for the same query to prevent duplicates
      return newData.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.query === item.query && !t.temp
        ))
      );
    });
    if (rankData.rank === 101) {
      toast.success(`'${query}' added successfully without rank!`);
    } else {
      toast.success(`"${query}" added successfully with rank: ${rankData.rank}`);

    }
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


  const [seriesData, setSeriesData] = useState([]);

  const fetchAndProcessChartData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/AvgLastRankPerDayView/${userId}/${projectId}/`);
      console.log(response)
      const data = response.data.daily_averages || [];
      const processedData = data.map(item => ({
        x: new Date(item.day),
        y: Math.round(item.average_rank),
      }));
      setSeriesData([{
        name: `Project ${projectId} Average Rank`,
        data: processedData,
      }]);
    } catch (error) {
      console.error(`Failed to fetch chart data:`, error);
      setSeriesData([{
        name: `Project ${projectId} Average Rank`,
        data: [],
      }]);
    }
  };

  useEffect(() => {
    fetchAndProcessChartData();
  }, [projectId, userId]);
 
  
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false, // Hide the toolbar if not needed
      },
    },
    colors: ['#ff7a00'], // This is where you can change the line color
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd MMM', // Change the format of the date if needed
      },
    },
    yaxis: {
      reversed: true, // Reverse the y-axis
      labels: {
        formatter: function (value) {
          return Math.round(value); // Convert to integer
        },
      },
      title: {
        text: 'Average Rank', // Add a title to Y-axis if needed
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2, // Adjust the width of the line
    },
    markers: {
      size: 5, // Adjust the size of the markers (data points)
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
      y: {
        formatter: function (value) {
          return `Rank: ${Math.round(value)}`; // Convert to integer
        },
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels to show the data point values on the chart
      formatter: function (value) {
        return Math.round(value); // Convert to integer
      },
    },
  });
 
 
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
  useEffect(() => {
    console.log(expandedRowId); // This will log the updated state after changes.
  }, [expandedRowId]);

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
      projectId, // Include projectId if your backend expects it
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
    await dispatch(fetchBookmarks({ projectId }));
  };

  useEffect(() => {
    if (projectId) {
      fetchAllBookmarks();
    }
  }, [projectId, dispatch]);

  const handleDeleteBookmark = async (userId, bookmarkId, projectId) => {

    // Find the bookmark to get its name for the toast message
    const bookmarkToDelete = filteredBookmarks.find(b => b.b_id === bookmarkId);
    if (!bookmarkToDelete) {
      console.error('Bookmark not found');
      return;
    }


    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bookmarks/delete/${userId}/${bookmarkId}/${projectId}/`, {
        method: 'DELETE',
      });
      console.log(response)
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

  const handleRenameBookmark = async (bookmarkId, newName, projectId) => {
    const bookmarkToRename = filteredBookmarks.find(b => b.b_id === bookmarkId);
    if (!bookmarkToRename) {
      console.error('Bookmark not found');
      return;
    }
    const oldName = bookmarkToRename.name;
    console.log(oldName)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bookmarks/update/${userId}/${bookmarkId}/${projectId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      console.log(response)

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
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${(item.query_id)}/${bookmarkId}/${projectId}/`;

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
      // If the checkbox is checked, add the row to both selectedRows and checkedRows
      const selectedRow = currentRows.find(row => row.query_id === query_id);
      setSelectedRows(prev => [...prev, selectedRow]);
      setCheckedRows((prev) => [...prev, query_id]);
    } else {
      // If the checkbox is unchecked, remove the row from both selectedRows and checkedRows
      setSelectedRows(prev => prev.filter(row => row.query_id !== query_id));
      setCheckedRows((prev) => prev.filter(id => id !== query_id));
    }
  };
  
  const resetSelections = () => {
    setSelectedRows([]);
    setCheckedRows([]);
    setSelectedTargetUrl("All Sources");
  };


  const isAllSelected = () => {
    return currentRows.length > 0 && checkedRows.length === currentRows.length;
  };
  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
        // Select all rows
        const allRowIds = currentRows.map((row) => row.query_id);
        setCheckedRows(allRowIds);
        // Assuming setSelectedRows is how you track row selections separately
        setSelectedRows(currentRows); 
    } else {
        // Deselect all rows
        setCheckedRows([]);
        setSelectedRows([]); // Reset individual selections as well
    }
};

  // State for storing the selected bulk action
  const [selectedBulkAction, setSelectedBulkAction] = useState("");
  // Assuming you already have state for bookmarks
  const [selectedBookmarkForAdding, setSelectedBookmarkForAdding] = useState(null);
  const confirmBulkUpdate = async () => {
    // Close the confirmation dialog
    setIsBulkUpdateDialogOpen(false);

    // Proceed with the bulk update after confirmation
    await handleBulkUpdate();

    // Add any post-update logic here, if necessary
  };
  const [isUpdatingInProgress, setIsUpdatingInProgress] = useState(false);
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);
  const [isAddingToBookmarkInProgress, setIsAddingToBookmarkInProgress] = useState(false);

  const handleBulkAction = async (action) => {
    if (bulkActionsDisabled) {
      toast.info("Please select at least one row.");
      return;
    }
    setSelectedBulkAction(action);

    // Check if any operation is in progress and stop the bulk action
    if (isUpdatingInProgress || isDeletingInProgress || isAddingToBookmarkInProgress) {
      toast.error("An operation is already in progress. Please wait until it's completed.");
      return;
    }

    switch (action) {
      case "update":
        setIsUpdatingInProgress(true); // Indicate that an update operation has started
        setIsBulkUpdateDialogOpen(true); // Assuming this state controls the visibility of your confirmation dialog
        break;
      case "delete":
        setIsDeletingInProgress(true); // Indicate that a delete operation has started
        checkedRows.forEach((queryId) => {
          handleDeleteButtonClick(queryId);
        });
        break;
      case "add":
        setIsAddingToBookmarkInProgress(true); // Indicate that an add to bookmark operation has started
        setShowBookmarkSelector(true);
        break;
      default:
        console.log("No action selected");
    }
  };



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
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${(queryDetails.query_id)}/${bookmarkId}/${projectId}/`;
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

  const options = useMemo(() => {
    let baseOptions = [
      { value: 'update', label: 'Update query' },
      { value: 'delete', label: 'Delete query' },
    ];
    if (filteredBookmarks.length > 0) {
      baseOptions.push({ value: 'add', label: 'Add to Bookmark', submenu: displayBookmarkSlice });
    }
    return baseOptions;
  }, [filteredBookmarks, displayBookmarkSlice]);
  const [bulkActionsDisabled, setBulkActionsDisabled] = useState(true);
  useEffect(() => {
    setBulkActionsDisabled(checkedRows.length === 0 || (selectedBulkAction === 'add' && filteredBookmarks.length === 0));
  }, [checkedRows, selectedBulkAction, filteredBookmarks]);

  const [showMainOptions, setShowMainOptions] = useState(false);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (selectedOption.value === 'add') {
      // Check if there are bookmarks available
      if (displayBookmarkSlice.length === 0) {
        // No bookmarks available, inform the user and prevent opening the bookmark selector
        toast.info('No bookmarks available. Please create a bookmark first', {
          position: "bottom-center",
          autoClose: 5000,
        });
      } else {
        // Bookmarks available, proceed to show the bookmark selector
        setShowBookmarkSelector(true);
      }
    } else {
      // If not the 'Add' option, proceed with the selected bulk action
      setShowBookmarkSelector(false);
      handleBulkAction(selectedOption.value);
    }
  };


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 2,
      borderColor: state.isFocused ? 'gray' : 'gray',
      boxShadow: state.isFocused ? '0 0 0 1px gray' : 'none',
      '&:hover': { borderColor: 'lightgray' },
      zIndex: state.isFocused ? '5' : '1',
      width: '450px'
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'gray',
      padding: 10,

    })
  };



  const bookmarkSelectorRef = useRef(null);
  const closeBookmarkSelector = () => {
    setShowBookmarkSelector(false);
    console.log(showBookmarkSelector)
  };



  // Use the hook
  useOutsideClick(bookmarkSelectorRef, closeBookmarkSelector);
  const fallbackCopyTextToClipboard = (text) => {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus(); // Focus on the textarea
    textArea.select(); // Select the text

    try {
      // Try to execute the copy command
      const successful = document.execCommand('copy');
      if (successful) {
        // Use the text variable dynamically in the toast message
        toast.info(`Copied "${text}" to clipboard successfully`, {
          position: "bottom-center",
          autoClose: 5000
        });
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error("Failed to copy to clipboard.", {
        position: "bottom-center",
        autoClose: 5000
      });
    }

    document.body.removeChild(textArea); // Cleanup
  };
  const [copiedRows, setCopiedRows] = useState(new Set());


  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Use the text variable dynamically in the toast message
        toast.info(`Copied "${text}" to clipboard successfully`, {
          position: "bottom-center",
          autoClose: 5000
        });
      }, (err) => {
        console.error("Error copying text to clipboard: ", err);
        toast.error("Error copying text to clipboard", {
          position: "bottom-center",
          autoClose: 5000
        });
      });
    } else {
      console.log("Clipboard API not available, using fallback.");
      fallbackCopyTextToClipboard(text);
    }
  };

  const handleToggleRow = (rowId, event) => {
    event.stopPropagation(); // Prevent triggering row selection
    // Toggle between the current row ID and null to expand/collapse
    setExpandedRowId((currentExpandedRowId) => (currentExpandedRowId !== rowId ? rowId : null));
  };

  const [editingQueryId, setEditingQueryId] = useState(null); // Tracks the ID of the query being edited
  const [editedQueryName, setEditedQueryName] = useState(""); // Temporarily holds the edited query name


  // Inside your functional component
  const [editingRowId, setEditingRowId] = useState(null); // Used to track which row is being edited
  const [tempQueryName, setTempQueryName] = useState(""); // Temporary holder for the edited query name
  const [queryNameError, setQueryNameError] = useState("");
 
 

  const handleEditClick = (queryId, currentQueryName) => {
    setEditingQueryId(queryId);
    setTempQueryName(currentQueryName); // Initialize with current query name
  };

  const handleQueryNameChange = (e) => {
    setTempQueryName(e.target.value);
  };

//editing query 

  // const submitNewQueryName = async (queryId) => {
  //   if (!tempQueryName.trim()) {
  //     setQueryNameError("Query name cannot be empty");
  //     return;
  //   }
  //   const updatedData = { query_name: tempQueryName };
  //   try {
  //     await handleUpdateQuery(userId, queryId, projectId, updatedData);
  //     setEditingQueryId(null); // Exit editing mode
  //     setTempQueryName(""); // Reset temporary query name
  //     dispatch(fetchData({ userId, projectId }))
  //     toast.success('Query updated successfully');


  //   } catch (error) {
  //     console.error("Failed to update query:", error);
  //     toast.error("Failed to update query");
  //   }
  // };

const [editProgress, setEditProgress] = useState(0); // Represents the progress of the edit operation in percentage
const [editError, setEditError] = useState(null); // Tracks if there was an error during editing
const handleEditSuccess = () => {
  setEditProgress(100); // Sets progress to 100% indicating completion
  setEditError(null); // Clears any existing errors
};

const handleEditError = (error) => {
  setEditError(error); // Sets the error received from the edit attempt
};

const renderEditProgressBar = () => {
  // You may want to clear the timeout if the component unmounts to prevent state updates on unmounted components
  if (!isEditInProgress && editProgress !== 100) {
    const timer = setTimeout(() => {
      setEditProgress(0);
    }, 5000);

    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }

  const progressBarColor = editError ? 'bg-red-500' : 'bg-green-500';
  const textColor = editError ? 'text-red-500' : 'text-green-500';
  const progressBarWidth = `${Math.min(editProgress, 100)}%`;

  return (
    <div className="my-2">
      <div className={`bg-gray-200 progress-bar-striped rounded-full h-[20px] overflow-hidden`}>
        <div
          style={{ width: progressBarWidth }}
          className={`h-full rounded-full ${progressBarColor} transition-all duration-500`}
        ></div>
      </div>
      <div className="mt-2 text-sm">
        <span className={`${textColor}`}>
          {editError ? `Editing failed: ${editError.message}` : editProgress === 100 ? "Edit completed successfully!" : "Editing in progress..."}
        </span>
      </div>
    </div>
  );
};

const submitNewQueryName = async (queryId) => {
  if (!tempQueryName.trim()) {
    setQueryNameError("Query name cannot be empty");
    return;
  }
  setIsEditInProgress(true); // Start editing
  setEditProgress(0); // Reset progress

  const updatedData = { query_name: tempQueryName };

  try {
    await handleUpdateQuery(userId, queryId, projectId, updatedData);
    // Simulate progress update
    setEditProgress(50); // Halfway through
    // Wait for something if needed
    setEditProgress(100); // Completed
    dispatch(fetchData({ userId, projectId })); // Refetch data

  } catch (error) {
    console.error("Failed to update query:", error);
    toast.error("Failed to update query");
  } finally {
    setIsEditInProgress(false); // End editing
  }
  toast.success('Query updated successfully');

  setEditingQueryId(null); // Exit editing mode
  setTempQueryName(""); // Reset temporary query name
};

  const exportToExcel = () => {
    // Using `currentRows` directly here, but you might fetch fresh data instead
    const data = currentRows.map(row => ({
      Query: row.query,
      Rank: row.rank,
      BestRank: row.best_rank,
      Date: row.date,
      Location: row.google_domain,
      Origin: row.source_url,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Keywords');
    XLSX.writeFile(workbook, 'KeywordsData.xlsx');
  };

  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef(null); // Reference to the filter's outer container
  const closeFilters = () => {
    setShowFilters(false);
  };

  // Use the custom hook, passing the ref and the close function
  useOutsideClick(filtersRef, closeFilters);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const [values, setValues] = useState([1, 100]);

  // Assuming tableData is your array of data objects
const rankValues = tableData.map(item => item.rank);
// Filter out ranks that are not within the desired range
const validRanks = rankValues.filter(rank => rank > 1 && rank < 101);

const [minRank, setMinRank] = useState(Math.min(...validRanks));
const [maxRank, setMaxRank] = useState(Math.max(...validRanks));
// Initialize the filter with the min and max values found
const [filter, setFilter] = useState({ min: minRank, max: maxRank });

console.log("This is filter", filter);
// const handleRangeChange = (e) => {
//   const value = Number(e.target.value);
//   const name = e.target.name;
//   if (name === 'min' && value < filter.max) {
//     setFilter({ ...filter, min: value });
//   } else if (name === 'max' && value > filter.min) {
//     setFilter({ ...filter, max: value });
//   }
// };
const handleRangeChange = ({ min, max }) => {
  setFilter({ min, max });
  // Now you can use filter.min and filter.max to filter your data
};
const applyFilters = () => {
  // You can now use `filter` to filter your `tableData` or perform other actions
  console.log(`Applying range filter: ${filter.min} - ${filter.max}`);
  // Example: Set the filtered data to a state, or fetch new data based on the range
  const newFilteredData = tableData.filter(item => 
    item.rank >= filter.min && item.rank <= filter.max
  );
  setFilteredData(newFilteredData)
  setShowFilters(false); 
};
// const filteredTableData = tableData.filter(item => item.rank >= filter.min && item.rank <= filter.max);

  return (
    <>
      <ConfirmationUpdate
        isOpen={isBulkUpdateDialogOpen}
        onClose={cancelBulkUpdate}
        onConfirm={confirmBulkUpdate}
        message="Are you sure you want to update the selected queries?"
        isUpdating={false}
      />

      {isDialogOpen && (
        <Confirmation
          isOpen={isDialogOpen}
          onClose={cancelDeletion}
          onConfirm={confirmDeletion}
          message="Are you sure you want to delete this query?"
          isDeleting={isDeleting}
        />
      )}


      {/* {isPopupVisible && (
        <Transition.Root
          show={isModal_Open}
          as={Fragment}>
          <Dialog as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={close_Modal}
            >
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

            <div 
            className="fixed inset-0 z-10 overflow-y-auto"
            >
              <div 
              className="flex items-center justify-center min-h-full p-4 text-center sm:p-0 "
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel 
                  className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
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
      )} */}

{isModal_Open && (
  <div 
    className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-opacity-30 opacity-100 backdrop-blur-sm transition-opacity duration-300"
    onClick={(event) => {
      // Check if the click is on the backdrop
      if (event.target === event.currentTarget) {
       setIsModal_Open(false)
      }
    }}
  >
    <div 
      className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg"
      onClick={(event) => event.stopPropagation()} // Prevent click from bubbling to the backdrop
    >
      {/* Modal Header */}
      <div className="bg-blue/20 border-b rounded-none border-blue shadow-none z-[10] p-2  text-center">
        <h1 className='font-semibold'>Single or Bulk keyword</h1>
      </div>
      
      {/* Modal Body */}
      <div className="px-[10px] py-[30px] ">
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
  </div>
)}

      <div className="w-[100%]  p-4 mt-[4rem] ">


        <div>


          <div className='flex space-x-3  w-[100%] p-4 m-auto animate-fade-in-down'>
           
 <div className='transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer w-[15%] '>
            <RankRange queries={tableData}/>
        
            </div>

    <div className=' w-[70%]  p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer '>
    <ReactApexChart
    options={chartOptions}
    series={seriesData}
    type="line"
   height={200}
  
  />
      </div>
            <div className='flex   w-[15%] flex-col p-4 transition duration-500 transform bg-white border-2 border-gray-200 rounded-lg cursor-pointer '>
           <div>
           <h1 className='mb-2 text-lg font-semibold text-gray-700'>Project Details </h1>

           </div>
            <div className='flex flex-col justify-between p-1 transition duration-500 transform cursor-pointer'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize'>project</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.name}</p>

              </div>

            </div>
            <div className='flex flex-col justify-between p-1 transition duration-500 transform cursor-pointer'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>Url</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.url}</p>
              </div>

            </div>
            <div className='flex flex-col justify-between p-1 transition duration-500 transform cursor-pointer'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>Created at</span>
                <p className='font-bold capitalize text-md text-greeng'>                {projectDetails?.created_at ? new Date(projectDetails.created_at).toISOString().split('T')[0] : 'N/A'}
</p>

              </div>

            </div>
            <div className='flex flex-col justify-between p-1 transition duration-500 transform cursor-pointer'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>Project ID</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.project_id}</p>



              </div>

            </div>
            </div>
          
          </div>


        </div>




        <div className="flex mb-4 -mx-2">

          <SearchBar handleSearchInputChange={handleSearchInputChange} searchQuery={searchQuery} />

          <div className="p-4 w-full md:w-[28.33%] px-2 z-[200]">
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



          <div className="p-4 w-full md:w-[28.33%] px-2 z-[-200]">
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



        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
              <ClipLoader size={100} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          </div>

        ) : (
          <div className="flex justify-between p-0 mt-4 border-t-2 border-gray-200 spac lg-plus:p-4">





            <div className={`moo     p-4 ${isSidebarOpen ? 'w-[100%] ' : 'w-[100%]'}`}>


              <div className='flex  items-center  justify-between space-x-[10px] mb-[20px]'> {/* Adjust the gap as needed */}
                {/* <div>

                  <div className='flex flex-col space-y-3'>


                    <div className='flex space-x-3'>



                  
                      <Select
                        value={selectedOption}
                        onChange={handleChange}
                        options={options}
                        styles={customStyles}
                        placeholder="Select Action"
                        isSearchable={false}
                        isDisabled={filteredData.length === 0 || isUpdateInProgress || isUpdating}// Disable if no data
                      />


                      {showBookmarkSelector && (
                        <div
                          ref={bookmarksRef}
                          className={`absolute left-[5px] z-50 mt-[50px] bg-white rounded-md w-[450px] border border-gray-300`}
                        >
                          {filteredBookmarks.length > 0 ? (
                            <div className="py-1">
                              {filteredBookmarks.map((bookmark, index) => (
                                <div
                                  key={bookmark.id}
                                  className={`block w-full p-2 text-sm text-left 
            ${index !== filteredBookmarks.length - 1 ? 'border-b' : ''} cursor-pointer hover:bg-gray-200`}
                                  onClick={() => handleAddToBookmark(bookmark.b_id)}
                                >
                                  {bookmark.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Show a message when no bookmarks are available
                            <div className="p-2 text-sm text-center text-gray-500">
                              No bookmarks found.
                            </div>
                          )}
                        </div>
                      )}

                    </div>



                  </div>




                </div> */}

                {selectedTargetUrl && (
                  <div className="font-bold">
                    <h3>Selected Target URL:
                      <span className="ml-2 text-blue-600">{selectedTargetUrl.label || selectedTargetUrl}</span>
                    </h3>
                  </div>
                )}
         
   

         <div>
      <button onClick={toggleFilters} className='relative flex items-center justify-between px-4 py-2 text-gray-400 transition duration-300 bg-white border-2 border-gray-200 rounded-lg '>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
        <span className={`ml-2 transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {showFilters && (
        <div className='w-[200px] bg-white shadow-md rounded border-2 border-gray-200 absolute  right-[4px]
       
       
         p-[20px] z-[10000] '>
          <RankRangeSlider minInitialValue={filter.min} maxInitialValue={filter.max} onRangeChange={handleRangeChange} />
          <button onClick={applyFilters} className='w-[100%] bg-blue text-white p-2 mt-4 '>Apply</button>
        </div>
      )}
    </div>

 




    { (showProgressBar || showAddProgressBar) && (
  <div className="flex items-center">
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
    >
      Stop Operations
    </button>
  </div>
)}


</div>
<div >

 
              </div>
         
              {
  !operationsCompleted && (
    <div className='addUpdateBox fixed bottom-[10px] right-[10px] z-[1000] p-4 w-[18%] lg-plus:w-[15%] bg-white border-2 border-gray-200 rounded-lg'>
      
      {/* Update Progress Bar */}
      {showProgressBar && (
        <div className='font-semibold mt-[5px] rounded-md z-[1000] bg-white'>
          {renderSharedProgressBar()}
          <div className='mt-2'>
            Updated {completedUpdates} of {totalUpdates} queries
            {updateErrors > 0 && <span className="ml-2 text-red-500">, with {updateErrors} error(s)</span>}
          </div>
        </div>
      )}
      
      {/* Edit Progress Bar */}
      {isEditInProgress && (
        <div className='font-semibold mt-[5px] rounded-md z-[1000] bg-white'>
          {renderEditProgressBar()}
        </div>
      )}
      
      {/* Add Progress Bar */}
      {showAddProgressBar && (
        <div className='z-[1000] bg-white'>
          <AddProgressBar />
          <div className='mt-2'>
            Added {completedAdds} of {totalAdds} queries
            {addErrors > 0 && <span className="ml-2 text-red-500">, with {addErrors} error(s)</span>}
          </div>
        </div>
      )}
      
    </div>
  )
}


             

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
            

<div className='mb-4 border-2 border-gray-200 head-table'>
  <div className="flex items-center justify-between p-4">
   <div className='flex items-center justify-center space-x-3'>
   {checkedRows.length > 0 ? (
      <span>{checkedRows.length} selected</span>
    ) : (
      <span>{filteredData.length} keyword{filteredData.length !== 1 ? 's' : ''}</span>
    )}

   <div>
   {checkedRows.length > 0 && (
      <div className='flex'>
       
<button
      onClick={handleBulkUpdate}
      disabled={isUpdateInProgress} // Disable the button based on the isUpdateInProgress state
      className={`flex items-center justify-center px-4 py-2 mr-2 border-r-2 border-gray-200 ${isUpdateInProgress ? 'cursor-not-allowed text-gray-500 bg-gray-200' : ''}`}
    >
      <FiRefreshCw className="mr-2" /> {/* Icon with margin-right to space it from the text */}
      Update Selected
    </button>
        <button
        onClick={handleBulkDelete} 
        className="flex items-center justify-center px-4 py-2 mr-2 border-r-2 border-gray-200 ">
           <FaTrash className="mr-2" />Delete Selected
          </button>
        
          <button onClick={toggleBookmarkSelector} 
        className="flex items-center justify-center px-4 py-2 mr-2 border-r-2 border-gray-200 ">
  <FaBookmark className="mr-2" />Add to favourite

</button>

      {show_BookmarkSelector && (
  <div
    ref={bookmarksRef}
    className={`absolute left-[27%] z-50  bg-white z-[10000] rounded-md w-[200px] border border-gray-300`}
  >
    {filteredBookmarks.length > 0 ? (
      <div className="py-1">
        {filteredBookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className={`block w-full p-2 text-sm text-left ${index !== filteredBookmarks.length - 1 ? 'border-b' : ''} cursor-pointer hover:bg-gray-200`}
            onClick={() => {
              handleAddToBookmark(bookmark.b_id);
              toggleBookmarkSelector(); // Optionally close the selector after a bookmark is selected
            }}
          >
            {bookmark.name}
          </div>
        ))}
      </div>
    ) : (
      <div className="p-2 text-sm text-center text-gray-500">
        No bookmarks found.
      </div>
    )}
  </div>
 )}
        
      </div>
    )}
    </div>

    </div>
    
    <button onClick={exportToExcel} className="px-4 py-2 text-white rounded bg-blue hover:bg-greeng">
      Export to Excel
    </button>
  </div>
</div>

    <div className='border-2 border-gray-200 rounded-lg table-parent '>

                <table
                  className="min-w-full divide-y divide-gray-200 ">
                     
    
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
                      <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase sticky-col-head">Details</th>




                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('query')}>
                        <span className='inline'>keywords </span>
                        {sortConfig.key === 'query' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline' />) : ''}

                      </th>


                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('rank')}>
                        <span className='inline'>Rank  </span>

                        {sortConfig.key === 'rank' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline' />) : ''}
                      </th>

                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('best_rank')}>
                        <span className='inline'>Best Rank  </span>
                        {sortConfig.key === 'best_rank' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline' />) : ''}
                      </th>
                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('date')}>
                        <span className='inline'>Date </span>

                        {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline' />) : ''}
                      </th>
                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('google_domain')}>
                        <span className='inline'>Location </span>

                        {sortConfig.key === 'google_domain' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline' />) : ''}
                      </th>

                      <th className="text-xs font-medium tracking-wider text-gray-500 uppercase cursor-pointer " onClick={() => requestSort('source_url')}>
                        <span className='inline'>Origin </span>

                        {sortConfig.key === 'source_url' ? (sortConfig.direction === 'ascending' ? <FaArrowUp className='inline' /> : <FaArrowDown className='inline' />) : ''}

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

                            key={row.query_id}
                            //   className={`hover:bg-[#f3f4f6]   
                            // cursor-pointer 
                            //  ${selectedRows.includes(row) ? 'bg-[#e2e8f0]' : ''}`}
                            className={`${selectedRows.some(selectedRow => selectedRow.query_id === row.query_id) ||
                                checkedRows.includes(row.query_id)
                                ? 'bg-[#f3f4f6]' // Highlight color if the row is either selected or checked
                                : ''
                              } hover:bg-[#f3f4f6] cursor-pointer`}

                            onMouseDown={(e) => handleRowClick(e, row.query_id)}
                            draggable={selectedRows.includes(row)}
                            onDragStart={handleDragStart}
                          >

                            <td className="px-6 py-4 sticky-col whitespace-nowrap checkbox-cell">

                              <input
                                type="checkbox"
                                checked={checkedRows.includes(row.query_id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSelectChange(e, row.query_id);
                                }}
                              />

                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button onClick={(event) => handleToggleRow(row.query_id, event)} className="focus:outline-none">
                                {expandedRowId === row.query_id ? (
                                  <FaChevronUp className="text-xl text-blue" /> // When row is expanded
                                ) : (
                                  <FaChevronDown className="text-xl text-blue" /> // When row is not expanded
                                )}
                              </button>
                            </td>
                     

<td className='flex items-center space-x-2'> {/* Adjust the spacing as needed */}
  {editingQueryId === row.query_id ? (
    // <input
    //   value={tempQueryName}
    //   onChange={handleQueryNameChange}
    //   onKeyDown={(e) => {
    //     if (e.key === 'Enter') submitNewQueryName(row.query_id);
    //     else if (e.key === 'Escape') setEditingQueryId(null);
    //   }}
    //   className="w-full form-input" // Ensure the input takes the full width
    //   autoFocus
    //   disabled={isEditInProgress} // Disable the input if edit is in progress
    // />
    <input
  value={tempQueryName}
  onChange={handleQueryNameChange}
  onKeyDown={(e) => {
    if (e.key === 'Enter') submitNewQueryName(row.query_id);
    else if (e.key === 'Escape') setEditingQueryId(null);
  }}
  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isEditInProgress ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
  autoFocus
  disabled={isEditInProgress} // Disable the input if edit is in progress
/>

  ) : (
    <>
      <div 
        className="flex-1 cursor-pointer tooltipcontainer" 
        onDoubleClick={() => handleEditClick(row.query_id, row.query)}
      >
        
      <button
        onClick={(event) => {
          event.stopPropagation(); // Stop row click event
          copyToClipboard(row.new_query);
          setCopiedRows((prev) => new Set(prev.add(row.query_id))); // Indicate that this row's query has been copied
        }}
        title="Copy to clipboard"
        className="p-1"
      >
        {copiedRows.has(row.query_id) ? (
          <FaCopy className="cursor-pointer" />
        ) : (
          <FaRegCopy className="cursor-pointer" />
        )}
      </button>

      {row.new_query && row.new_query.length > 15 ? (

          <>
            <span className="tooltiptext">{row.new_query}</span>
            {row.new_query.substring(0, 15)}...
          </>
        ) : (
          <span>{row.new_query}</span>
        )}
      </div>

    </>
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
                              {row.google_domain}
                              {/* <img src={locationImages[row.google_domain]} alt={row.google_domain} className="w-6" /> */}
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
                                    <BiDotsVertical size={25} className='p-1 m-3 rounded-full cursor-pointer hover:bg-gray-300 ' />
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
                                    <Menu.Items className="absolute top-[-55px] overflow-auto h-[105px]
    z-10 p-2 right-[45px]  w-[110px]
    bg-white rounded-lg shadowmenu">

                                      {/* Update Button */}
                                      <Menu.Item>
                                        {({ active }) => (
                                          <div className=''>
                                            <button
                                              onClick={(e) => handleUpdateButton_Click(e, userId, row.query_id, row.project)}
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
                                      {/* <Menu.Item>
                                        {({ active }) => (
                                          <div className='py-2'>


                                            <button
                                        
                                        onClick={() => {
                                          const updatedData = { query_name: queryName };
                                          handleUpdateQuery(userId, row.query_id, projectId, updatedData);
                                          setQueryName(""); // Reset input field after submission
                                        }}
                                              className="flex items-center justify-around rounded-lg "
                                            >
                                              <FaEdit className="mr-2 hover:text-blue-600" />
                                              <span className=' ml-[5px]  text-sm'>  Edit</span>

                                            </button>

                                          </div>
                                        )}
                                      </Menu.Item> */}

                                      <Menu.Item>
                                        {({ active }) => (
                                          <div className='py-2'>
                                            <button
                                             onClick={(event) => {
                                              event.stopPropagation(); // Prevent triggering the row's onClick event
                                              handleEditClick(row.query_id, row.query);
                                            }}
                                              className="flex items-center justify-around rounded-lg"
                                            >
                                              <FaEdit className="mr-2 hover:text-blue-600" />
                                              <span className=' ml-[5px]  text-sm'>Edit</span>
                                            </button>
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
                              <td colSpan="100% ">
                                {row &&
                                  <TabsProjects
                                    rowData={row}
                                    queryId={row.query_id}
                                    projectId={projectId}
                                  />
                                }
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

                 
                </div>


              </div>
              {isFolderSelected && (
                <BookmarkDetails bookmarkId={selectedBookmarkId} />

              )}

            </div>
            {/* {isSidebarOpen &&
              <div className={`relative  lg-plus:z-[99] z-[99999]   rounded-[10px] p-4 w-[20]`}
              >
                <div
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
                            placeholder="Favourit..."
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
                                          handleRenameBookmark(bookmark.b_id, bookmarkNames[bookmark.b_id] ?? bookmark.name, projectId);


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
                                            <button onClick={() => handleDeleteBookmark(userId, bookmark.b_id, projectId)}
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
            } */}







          </div>
        )}
      </div>

    </>
  );
};

export default Projectranks;