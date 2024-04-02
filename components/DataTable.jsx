
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRank } from '../redux/lib/fetchRanks';
import { format } from 'date-fns';
import ClipLoader from "react-spinners/ClipLoader";
import { ImSpinner11 } from "react-icons/im";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteRank } from '../redux/lib/deleteRow'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  rankschema } from '../utils/validation';
import axios from 'axios';
import EGYPT from '../assets/images/EGYPT.png'
import USA from '../assets/images/USA.png'
import AE from '../assets/images/DUBAI.png'
import LocationFilter from './LocationFilter';
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import BookmarkSidebar from './Bookmark/BookmarkSidebar';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { FaPlus } from 'react-icons/fa'; // Importing an icon
import TabsCustomAnimation from '../components/Tabs/queryTabs';
import { BiDotsVertical } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { FaArrowsToEye } from "react-icons/fa6";
import { Menu } from '@headlessui/react';
import { FaStar } from "react-icons/fa";
import SearchBar from './ranktracker/Searchbar';
import { resetFavorites } from '../redux/lib/favoritesSlice'
import { IoMdArrowBack } from "react-icons/io";
import BookmarkDetails from './Bookmark/BookmarkDetails';
import { addRank }from '../redux/lib/addRank';

const DataTableComponent = () => {
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const detailData = useSelector((state) => state.favoritesSlice.favorites);
  
  
  
  const [updateErrors, setUpdateErrors] = useState(0);
  const [totalUpdates, setTotalUpdates] = useState(0);
  const [completedUpdates, setCompletedUpdates] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(true); // New state
  const [fadeOut, setFadeOut] = useState(false);


  const [totalAdds, setTotalAdds] = useState(0);
  const [completedAdds, setCompletedAdds] = useState(0);
  const [addErrors, setAddErrors] = useState(0);
  const [showAddProgressBar, setShowAddProgressBar] = useState(false);

  
 
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
      }, 3000);

      return () => {
        clearTimeout(fadeOutTimer);
      };
    }
  }, [completedUpdates, updateErrors, totalUpdates, showProgressBar]);

  //Add progressbar 

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
    }, 3000); // Delay of 3000ms

    return () => clearTimeout(timer);
  }
}, [completedAdds, addErrors, totalAdds, showAddProgressBar]); // Dependencies include the add operation state and the visibility of the add progress bar

  const [draggedRow, setDraggedRow] = useState(null);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedTargetUrl, setSelectedTargetUrl] = useState('All Sources');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [folderRanks, setFolderRanks] = useState({});
  const [averageRank, setAverageRank] = useState();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const toggleDropdown = (query_id) => {
    setActiveDropdown(activeDropdown === query_id ? null : query_id);
  };
  const [isItemDropped, setIsItemDropped] = useState(false);
  const [isSidebarOpenn, setIsSidebarOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const displayBookmarks = useSelector((state) => state.displayBookmarkSlice.bookmarks);
  console.log(displayBookmarks)





  const [isModal_Open, setIsModal_Open] = useState(false);
  const open_Modal = () => setIsModal_Open(true);
  const close_Modal = () => setIsModal_Open(false);
  // Function to close the sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const isSidebarOpen = useSelector((state) => state.SidebarSlice.isOpen);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    value: 'EG',
    label: 'Egypt',
    icon: <img src={EGYPT} alt="Egypt" />,
  });
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All Locations');
  // const [updatingRow, setUpdatingRow] = useState(null);
  const [updatingRows, setUpdatingRows] = useState(new Set());

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const userId = useSelector(state => state?.authSlice?.id);
  console.log(userId);
  const dispatch = useDispatch();
  const rankData = useSelector((state) => state.rankSlice.data);
  console.log(rankData)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetUrls, setSelectedTargetUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const animatedComponents = makeAnimated();
  const [dataFetched, setDataFetched] = useState(false);
  const [queryInfo, setQueryInfo] = useState(null);
  const [isDropped, setIsDropped] = useState(false);
  const [filteredData, setFilteredData] = useState(rankData);



  const hasRealData = filteredData.some(row => !row.noDataIndicator);


  const [activeTab, setActiveTab] = useState("single"); // Changed "keyword" to "query"


  const customStyles = {
    rows: {

    },
    headCells: {
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#FF7A00',
      },
    },
  };
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
        setFilteredData(rankData);
      } else {
        // Filter data based on selected location
        const newData = rankData.filter(item => item.google_domain === selectedLocationFilter);
        setFilteredData(newData);
      }
    };

    // Call the reset function when the location filter changes
    resetDataByLocation();
  }, [selectedLocationFilter, rankData]);


  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const updateFilteredData = () => {
    let filteredResult = [...rankData];

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
  }, [searchQuery, selectedTargetUrl, selectedLocationFilter, rankData]);


  const NoDataComponent = () => (
    <div className="text-center" style={{ padding: '20px', gridColumn: '1 / -1' }}>
      No data
    </div>
  );



  useEffect(() => {
    if (!dataFetched) {
      setLoading(true);
      dispatch(fetchRank(selectedTargetUrls))
        .then(() => {
          setLoading(false);
          setDataFetched(true);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [dataFetched, dispatch, selectedTargetUrls]);
  useEffect(() => {
    setFilteredData(rankData);
  }, [rankData]);
  useEffect(() => {
    updateFilteredData();
  }, [searchQuery, selectedTargetUrls, rankData]);

  const uniqueTargetUrls = [
    'All Sources',
    ...new Set(rankData.map((item) => item.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')))
  ];
  const handleDeleteButtonClick = (query_id) => {
    dispatch(deleteRank(query_id))
      .unwrap()
      .then(() => {
        setFilteredData(currentData =>
          currentData.filter(rank => rank.query_id !== query_id)
        );
        toast.success('Rank deleted successfully!');
      })
      .catch((error) => {

        console.error('Error deleting rank:', error);

        toast.error(`An error occurred: ${error?.message || 'Unknown error'}`);
      });
  };


  const handleUpdateButtonClick = async (event, query_id, query, targetUrl, google_domain) => {
    event.stopPropagation();
    setShowProgressBar(true);

    setTotalUpdates(prev => prev + 1);

    try {
      setUpdatingRows(prev => ({ ...prev, [query_id]: true }));
      setIsUpdating(true);
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/update-single-rank/${userId}/${query}/${targetUrl}/${google_domain}/`, {});
      if (response.status === 200) {
        toast.success(`${query} Update successful`);
        setCompletedUpdates(prev => prev + 1);
      } else {
        toast.error('Update failed');
      }
    }

    catch (error) {
      console.error('Error updating rank:', error);
      toast.error('An error occurred while updating the rank.');
      setUpdateErrors(prevErrors => prevErrors + 1); // Increment the error count
      // Other existing code



    } finally {
      setUpdatingRows(prev => ({ ...prev, [query_id]: false }));
      setIsUpdating(false);
    }
  };

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

    // Adjusted width calculation to ensure the progress bar fills up based on the ratio of completed updates, even if some have failed.
    const progressBarWidth = `${Math.min((completedUpdates / totalUpdates) * 100, 100)}%`;

    return (
      <div className="my-2">
        <div className=" progress-bar-striped   bg-gray-200 rounded-full h-[5px] overflow-hidden">
          <div
            className={` progress-bar-striped ${fadeOut ? 'fade-out' : ''} h-full rounded-full ${progressBarColor} transition-all duration-500`}
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
        {!hasErrors && completedUpdates > 0 && <div className="mt-2 text-sm text-green-500">Update Completed Successfully!</div>}
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
          <div className="mt-2 text-sm text-red-500">
            Some additions failed.
          </div>
        )}
        {!hasErrors && completedAdds > 0 && (
          <div className="mt-2 text-sm text-green-500">
            Addition Completed Successfully!
          </div>
        )}
      </div>
    );
  };
  // const renderSharedProgressBar = () => {
  //   if (!progressBarVisible) return null;

  //   const isLoading = completedUpdates + updateErrors < totalUpdates;
  //   const hasErrors = updateErrors > 0; // Check if there are any errors
  //   const isCompleteOrHasError = completedUpdates > 0 || hasErrors; // Adjusted logic to consider any progress as completion

  //   // Choose progress bar color based on state
  //   // If there are errors, but some updates are successful, show a different color (e.g., orange) to indicate partial success with issues.
  //   const progressBarColor = hasErrors ? (completedUpdates > 0 ? 'bg-orange-500' : 'bg-red-500') : 'bg-green-500';

  //   // Text color based on the completion and error status
  //   const textColor = hasErrors ? 'text-red-500' : 'text-green-500';

  //   // Adjusted width calculation to ensure the progress bar fills up based on the ratio of completed updates, even if some have failed.
  //   const progressBarWidth = `${Math.min((completedUpdates / totalUpdates) * 100, 100)}%`;

  //   return (
  //     <div className="my-2">
  //       <div className=" progress-bar-striped   bg-gray-200 rounded-full h-[20px] overflow-hidden">
  //         <div
  //           className={` progress-bar-striped ${fadeOut ? 'fade-out' : ''} h-full rounded-full ${progressBarColor} transition-all duration-500`}
  //           style={{ width: progressBarWidth }}
  //         >
  //           {isCompleteOrHasError && (
  //             <div className="flex items-center justify-end h-full pr-2">
  //               {hasErrors ? (
  //                 <svg className="w-4 h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //                 </svg>
  //               ) : (
  //                 <svg className="w-4 h-[20px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //                 </svg> // Checkmark for success
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //       <span className={`${textColor} text-sm mt-[10px]`}>
  //         {isCompleteOrHasError ? `Completed with ${completedUpdates} success${completedUpdates > 1 ? 'es' : ''} and ${updateErrors} error${updateErrors > 1 ? 's' : ''}` : "Loading..."}
  //       </span>
  //       {hasErrors && <div className="mt-2 text-sm text-red-500">Some updates failed.</div>}
  //       {!hasErrors && completedUpdates > 0 && <div className="mt-2 text-sm text-green-500">Update Completed Successfully!</div>}
  //     </div>
  //   );
  // };


  const DraggableRow = ({ item, children, ...props }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: `draggable-${item.query_id}`,
      data: item,
    });




    // Add class or style when the row is selected

    return (
      <div ref={setNodeRef} {...listeners} {...attributes}  {...props}>
        {children}
      </div>

    );
  };


  const renderAccordionContent = (row) => {
    // Render TabsCustomAnimation with the row data
    return (
      <div className="p-4">
        <TabsCustomAnimation rowData={row} />
      </div>
    );
  };
  const handleRowClicked = row => {
    // Toggle accordion for the clicked row
    setActiveAccordion(activeAccordion === row.query_id ? null : row.query_id);
    setDraggedRow(row.query_id);

  };



  
  const columns = [

    {
      name: 'keywords',
      maxWidth: '20%',

      sortable: true,
      selector: (row) => row.query,

      cell: (row) => (
        <DraggableRow item={row}>

          <>
            {row.noDataIndicator ? <div className="text-center" >  </div> :
              <>
                {row.query}

              </>
            }
          </>

        </DraggableRow>

      ),
    },

    // {
    //   name: 'Rank',
    //   maxWidth: '5%',
    //   sortable: true,
    //   selector: (row) => row.rank,
    //   cell: row => {
    //     // Don't display anything if there's an indicator for no data
    //     if (row.noDataIndicator) {
    //       return null;
    //     }
  
        
  
    //     return (
    //       <div className="relative text-center">
    //         {/* Conditionally render or hide the rank difference */}
    //         {row.rank_difference !== null && (
    //           <div
    //             className={`absolute top-[-10px] right-[-17px] font-bold text-md ${row.rank === 0 ? 'd-none':''}
    //             ${row.rank_difference > 0 ? 'text-green-500' : row.rank_difference < 0 ? 'text-red-500' : ''}`}
               
    //           >
    //             {row.rank_difference > 0 ? `+${row.rank_difference}` : row.rank_difference < 0 ? row.rank_difference : ''}
    //           </div>
    //         )}
    //         <div>{row.rank}</div>
    //       </div>
    //     );
    //   },
    // },
    {
      name: 'Rank',
      maxWidth: '5%',
      sortable: true,
      selector: (row) => row.rank,
      cell: row => {
        // Don't display anything if there's an indicator for no data
        if (row.noDataIndicator) {
          return null;
        }
    
        // Decide whether to hide the rank difference
        const rankDifferenceClass = row.rank === 0 ? 'hidden' : row.rank_difference > 0 ? 'text-green-500' : 'text-red-500';
    
        return (
          <div className="relative text-center">
            {/* Use the rankDifferenceClass to conditionally add 'd-none' */}
            {row.rank_difference !== null && (
              <div
                className={`absolute top-[-10px] right-[-17px] font-bold text-md ${rankDifferenceClass}`}
              >
                {row.rank_difference > 0 ? `+${row.rank_difference}` : row.rank_difference < 0 ? row.rank_difference : ''}
              </div>
            )}
            <div>{row.rank}</div>
          </div>
        );
      },
    },    
    {
      name: (
        <span className='flex '>
          Best  &nbsp; <FaStar /> {/* Combining text and icon */}
        </span>
      ),
      maxWidth: '5%',
      sortable: true,
      selector: (row) => row.rank_abs,
      cell: row => row.noDataIndicator ? null :


        <div className='flex items-center justify-between'>
          <span>{row.best_rank}</span>

        </div>


    },


    {
      name: 'Date',
      sortable: true,

      maxWidth: '20%',
      selector: row => row.date,
      cell: row => row.noDataIndicator ? 'No data Found' :

        <div>{format(new Date(row.date), 'dd MMM yyyy')}</div>
    },





    {
      name: 'Location',
      sortable: true,
      maxWidth: '20%',

      selector: (row) => row.google_domain,
      cell: (row) => (

        <div className="flex items-center justify-center ">
          {row.google_domain === 'US' && (
            <img className="w-6" src={USA} alt="USA" title="United States" />
          )}
          {row.google_domain === 'EG' && (
            <img className="w-6" src={EGYPT} alt="Egypt" title="Egypt" />
          )}
          {row.google_domain === 'AE' && (
            <img className="w-6" src={AE} alt="Dubai" title="Dubai" />
          )}
        </div>
      ),
    },
    {
      name: 'Origin',
      sortable: true,
      cell: (row) => {
        // Check if row is a placeholder for loading data
        if (row.temp) {
          return (
            <div className="text-center">
              Loading...
            </div>
          );
        }

        // Check for no data indicator or invalid source URL
        if (row.noDataIndicator || !row.source_url || typeof row.source_url !== 'string') {
          return null;
        }

        // Regular expression for Arabic characters
        const arabicRegex = /[\u0600-\u06FF]/;

        // Check if the URL contains Arabic characters
        if (arabicRegex.test(row.source_url)) {
          // Log the Arabic URL to the console
          console.log("Arabic URL:", row.source_url);

          // Handle the case for Arabic URL here
          // You can modify this part based on your specific needs
          return (

            <div>
              Arabic URL: {row.source_url}
            </div>




          );
        }
        else {
          // Regular expression for the last part of the URL
          const regex = /\/([^\/]*)\/?$/;
          const matches = row.source_url.match(regex);
          const lastSegment = matches && matches[1] ? decodeURIComponent(matches[1]) : '';

          if (lastSegment) {
            return (

              <div className="tooltip-container ">
                <span className="tooltip-text ">{decodeURIComponent(row.source_url)}</span>
                <br />
                <a href={row.source_url} target="_blank"
                  rel="noopener noreferrer">
                  {lastSegment}
                </a>
              </div>
            );

          }

          // Fallback for URLs that do not contain the last segment
          return (
            <div>
              URL does not have a recognizable last segment.
            </div>
          );
        }
      },
    },


    {
      name: 'Actions',
      sortable: true,
      maxWidth: '5%',
      cell: (row, rowIndex) => {
        if (row.noDataIndicator) {
          return ' ';
        }

        return (
          <Menu as="div" className="px-[10px] pt-[10px]
         relative inline-block text-left 
        hover:bg-gray-300  p-1 rounded-full transition-all
         duration-300 ease-in-out 
         " onClick={() => toggleDropdown(row.query_id)}>
            <Menu.Button >
              <BiDotsVertical size={18} className='cursor-pointer ' />
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
              <Menu.Items className="absolute right-[20px] 
    z-10 p-2 top-[0px]  w-[110px]
    bg-white rounded-lg shadowmenu">

                {/* Update Button */}
                <Menu.Item>
                  {({ active }) => (
                    <div className='p-2 '>

                      <button
                        onClick={(e) => handleUpdateButtonClick(e, row.query_id, row.query, row.target_url, row.google_domain)}
                        className={`  rounded-lg flex items-center   ${updatingRows[row.query_id] ? 'cursor-not-allowed' : ''}`}
                      >
                        {updatingRows[row.query_id] ? (
                          <ClipLoader size={12} color={'green'} loading={true} />
                        ) : (
                          <ImSpinner11 className="mr-2 hover:text-blue-600" />
                        )}
                        <span className=' ml-[5px]  text-sm'>  Update</span>

                      </button>

                    </div>
                  )}
                </Menu.Item>

                {/* Delete Button */}
                <Menu.Item>
                  {({ active }) => (
                    <div className='p-2 '>


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
                    <div className='p-2 '>


                      <Link className='flex items-center rounded-lg text-slate-500'
                        to={`/details/${userId}/${encodeURIComponent(row.query)}/${encodeURIComponent(row.target_url)}/${row.google_domain}`}>
                        <FaArrowsToEye className="mr-2 hover:text-blue-600" />
                        <span className=' text-sm ml-[5px]'>View &nbsp;</span>
                      </Link>

                    </div>
                  )}
                </Menu.Item>

              </Menu.Items>
            </Transition>
          </Menu>
        );
      },
    },

  ];


  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleTargetUrlFilterChange = (selectedOption) => {
    setSelectedTargetUrl(selectedOption ? selectedOption.value : 'All Sources');
  };

  const { handleSubmit, control, register, reset, formState: { errors } } = useForm({
    resolver: zodResolver(rankschema),
  });







  // const onBulkSubmit = async (data) => {
  //   setIsDataLoading(true);
  //   close_Modal();
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);
  //   setIsAdding(true);
  //   reset({ keywords: '', url: '' });

  //   const currentDate = new Date();
  //   const queries = data.keywords.split('\n').map(line => line.trim()).filter(line => line);

  //   const tempKeywordData = queries.map(query => ({
  //     query,
  //     target_url: data.url,
  //     google_domain: selectedLocation?.value,
  //     temp: true,
  //     date: currentDate,
  //     rank: 'Loading...',
  //     best_rank: 'Loading...',
  //     origin: 'Loading...',
  //   }));

  //   setFilteredData(currentData => [...tempKeywordData, ...currentData]);
  //   console.log(rankData)
  //   for (const query of queries) {
  //     try {
  //       const keywordData = {
  //         query,
  //         target_url: data.url,
  //         google_domain: selectedLocation?.value,
  //       };
  //       const response = await dispatch(addRank(keywordData)).unwrap();  
  //       if (Array.isArray(response) && response.length > 0) {
  //         console.log(response)
  //         const rank = response[0][0].rank;
  //         const originData = response[0][0].source_url;
  //         const bestData = response[0][0].rank; 


  //         setFilteredData(currentData => {
  //           return currentData.map(item => {
  //             if (item.temp && item.query === query) {
  //               // Update row with actual data
  //               return { ...item, rank: rank, best_rank: bestData, source_url: originData, temp: false };
  //             }
  //             return item;
  //           });
  //         });

  //         toast.success(`"${query}" added successfully with rank: ${rank}`);
  //       } else {
  //         throw new Error('Invalid response format or no data returned for query: ' + query);
  //       }
  //     } catch (error) {
  //       toast.error(`Error: ${error.message}`);
  //       // Update the status of failed queries
  //       setFilteredData(currentData => {
  //         return currentData.map(item => {
  //           if (item.temp && item.query === query) {
  //             return { ...item, rank: 'Error', best_rank: 'Error', origin: 'Error', temp: false };
  //           }
  //           return item;
  //         });
  //       });
  //     }
  //   }


  // }


  //   setIsSubmitting(false);
  //   setIsAdding(false);
  //   setIsDataLoading(false);
  //   setHasSubmitted(true);

  // };




  // const onBulkSubmit = async (data) => {
  //   setIsDataLoading(true); 
  //   close_Modal();
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);
  //   setIsAdding(true);
  //   reset({ keywords: '', url: '' });
  
  //   const currentDate = new Date();
  //   const queries = data.keywords.split('\n').map(line => line.trim()).filter(line => line);

  
  //   // Add temporary rows for each query with a 'Loading...' state
  //   const tempKeywordData = queries.map(query => ({
  //     query,
  //     target_url: data.url,
  //     google_domain: selectedLocation?.value,
  //     temp: true,
  //     date: currentDate,
  //     rank: 'Loading...',
  //     best_rank: 'Loading...',
  //     origin: 'Loading...',
  //   }));
  
  //   setFilteredData(currentData => [...tempKeywordData, ...currentData]);
  //   console.log(rankData)
  //   for (const query of queries) {
  //     try {
  //       const keywordData = {
  //         query,
  //         target_url: data.url,
  //         google_domain: selectedLocation?.value,
  //       };
    
  
  //       const response = await dispatch(addRank(keywordData)).unwrap();
  
  //       if (Array.isArray(response) && response.length > 0) {
  //         console.log(response)
  //         const rank = response[0][0].rank;
  //         const originData = response[0][0].source_url;
  //         const bestData = response[0][0].rank; // Corrected way to access best_rank
          
  
  //         setFilteredData(currentData => {
  //           return currentData.map(item => {
  //             if (item.temp && item.query === query) {
  //               // Update row with actual data
  //               return { ...item, rank: rank, best_rank:bestData , source_url: originData, temp: false};
  //             }
  //             return item;
  //           });
  //         });
  //         toast.success(`"${query}" added successfully with rank: ${rank}`);
  //       } else {
  //         throw new Error('Invalid response format or no data returned for query: ' + query);
  //       }
  //     } catch (error) {
  //       toast.error(`Error: ${error.message}`);
  //       // Update the status of failed queries
  //       setFilteredData(currentData => {
  //         return currentData.map(item => {
  //           if (item.temp && item.query === query) {
  //             return { ...item, rank: 'Error', best_rank: 'Error', origin: 'Error', temp: false };
  //           }
  //           return item;
  //         });
  //       });
  //     }
  //   }
  // // Process each query and update its status





  //   setIsSubmitting(false);
  //   setIsAdding(false);
  //   setIsDataLoading(false);
  //   setHasSubmitted(true);
  
  // };



const token=useSelector((state)=>state.authSlice.token)
  const onBulkSubmit = async (data) => {
    console.log("Form data received:", data); 
    setIsDataLoading(true); 
    close_Modal();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsAdding(true);
    reset({ keywords: '', url: '' });
  
    const currentDate = new Date();
    const queries = data.keywords.split('\n').map(line => line.trim()).filter(line => line);
    setTotalAdds(queries.length);
    setCompletedAdds(0);
    setAddErrors(0);
    setShowAddProgressBar(true); // Show the progress bar
    
      
    console.log("URL captured:", data.link);

    const tempKeywordData = queries.map(query => ({
      query,
      target_url: data.url ,
      google_domain: selectedLocation?.value,
      temp: true,
      date: currentDate,
      rank: 'Loading...',
      best_rank: 'Loading...',
      origin: 'Loading...',
    }));
  
    console.log(tempKeywordData);
    setFilteredData(currentData => [...tempKeywordData, ...currentData]);
    for (const query of queries) {
      try {
        const keywordData = {
          query,
          target_url: data.url,
          google_domain: selectedLocation?.value,
        };
        // const csrfToken = csrfToken();

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/add-single-rank/${userId}/`, keywordData, {
          headers: {
            // 'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
    
        console.log(response.data);
    
        if (Array.isArray(response.data) && response.data.length > 0) {
          const rankData = response.data[0][0]; // Assuming this is the structure
          const rank = rankData.rank;
          const originData = rankData.source_url;
          const bestData = rankData.rank; 
    
          // No need to check for rank === 0 specifically; we'll include it directly
          setFilteredData(currentData => {
            return currentData.map(item => {
              if (item.temp && item.query === query) {
                // Update row with actual data, including rank 0
                return { ...item, rank: rank, best_rank: bestData, source_url: originData, temp: false };
              }
              return item;
            });
          });
    
          // Provide feedback based on rank value
          if (rank === 0) {
            toast.info(`"${query}" added but did not rank within the top 100.`);
          } else {
            toast.success(`"${query}" added successfully with rank: ${rank}`);
          }
        } else {
          throw new Error('Invalid response format or no data returned for query: ' + query);
        }
        setCompletedAdds((prev) => prev + 1);

      } catch (error) {
        console.error('Error:', error);
        toast.error(`Error: ${error.message}`);
        // Handle the temporary data as error state
        setFilteredData(currentData => {
          return currentData.map(item => {
            if (item.temp && item.query === query) {
              return { ...item, rank: 'Error', best_rank: 'Error', origin: 'Error', temp: false };
            }
            return item;
          });
        });
      }
      setIsAdding(false);
    }
    
    setIsSubmitting(false);
    setIsAdding(false);
    setIsDataLoading(false);
    setHasSubmitted(true);
    
   
  };



  const handleDragStart = (event) => {
    const { active } = event;
    const item = rankData.find((data) => `draggable-${data.query_id}` === active.id);

    if (item) {

      setDraggedItem(item);
    } else {
      console.log('Item not found for id:', active.id);
    }
  };
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over) {
      const dropData = over.data.current;
      setIsItemDropped(true);

      if (active) {
        const dragData = active.data.current;
        const { query, target_url, google_domain } = dragData;
        const { b_id } = dropData;
        setIsItemDropped(true);
        setDraggedItem({ query: dragData.query, bookmark: dropData.name });

        const apiUrl = `${process.env.REACT_APP_API_URL}/api/favourites/${userId}/${encodeURIComponent(query)}/${target_url}/${google_domain}/${b_id}/`;

        try {
          const response = await axios.get(apiUrl);
          console.log("API Response:", response.data.rank);

          // Extract the rank value from the response
          const currentRank = response.data.rank;

          setFolderRanks((prevRanks) => {
            const updatedRanks = { ...prevRanks };

            if (!updatedRanks[b_id]) {
              updatedRanks[b_id] = [];
            }

            // Check if the currentRank is already in the folderRanks array
            if (!updatedRanks[b_id].includes(currentRank)) {
              updatedRanks[b_id].push(currentRank);
            }

            localStorage.setItem('folderRanks', JSON.stringify(updatedRanks));

            return updatedRanks;
          });

          const ranksForFolder = folderRanks[b_id] || [];
          const averageRank = ranksForFolder.length
            ? ranksForFolder.reduce((sum, rank) => sum + rank, 0) / ranksForFolder.length
            : 0;
          setAverageRank(averageRank);

        } catch (error) {
          console.error('Error making API call:', error);
        }
      }
    }
    setDraggedRow(null);

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
      setIsItemDropped(false); // Reset the state
    }
  }, [isItemDropped]);

  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const totalRows = rankData.length; // Assuming rankData is your dataset
  const allRowsValue = 10000; // A large number for 'All'

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





  const conditionalRowStyles = [
    {
      when: row => row.noDataIndicator,
      style: {
        display: 'flex', // Use flexbox to center content
        justifyContent: 'center', // Horizontally center the content
        alignItems: 'center', // Vertically center the content
        height: '20%', // Set the height you want for the row
        // If you know the height of your rows, you can set a fixed height here
        textAlign: 'center', // Center align the text
        // Apply this style to all cells in the row
        '& > *': {
          flex: 1, // This makes each cell flex to fill the row
        }
      },
    },
  ];




  useEffect(() => {
    if (detailData && detailData.length > 0) {
      const detailQueryIds = detailData.map(item => item.rank.query_id);

      const newFilteredData = rankData.filter(item => detailQueryIds.includes(item.query_id));
      console.log(newFilteredData)
      setIsFolderSelected(true)
      setFilteredData(newFilteredData);
    } else {
      // Fall back to the original data or any other default state
      setFilteredData(rankData);
    }
  }, [detailData, rankData]);

  useEffect(() => {
    setFilteredData(rankData);
  }, [rankData]);

  useEffect(() => {
    // Only reset to rankData if no folder is selected
    if (!isFolderSelected) {
      setFilteredData(rankData);
    }
  }, [rankData, isFolderSelected]);


  const handleResetFilter = () => {
    dispatch(resetFavorites()); // Reset the favorites data in the global state

    setFilteredData(rankData);
    setIsFolderSelected(false); // Update state to indicate no folder is selected
  };





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
  placeholder="Add URL"
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



        {/* {
          (filteredData && filteredData.length > 0) && (  */}
            <div className="flex mb-4 -mx-2">

              <SearchBar handleSearchInputChange={handleSearchInputChange} searchQuery={searchQuery} />

              <div className="p-4 w-full md:w-[28.33%] px-2">
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
     {/* )
       } */}


        {loading ? (


          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
              <ClipLoader size={100} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          </div>

        ) : (
          <div className="flex p-0 mt-4 border-t-2 border-gray-200 lg-plus:p-4">



            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}>

              <div className={`moo  pr-[2.5rem] p-4 ${isSidebarOpen ? 'w-[70%] lg-plus:w-[80%]' : 'w-[100%]'}`}>



   
              <div className='fixed bottom-[120px] z-[1000]  p-4' >





{showProgressBar && (
    <div className='font-semibold mt-[1rem] 

rounded-md 
p-[1rem] pt-[2rem]  m-2  
fixed bottom-[10px] z-[1000] bg-white right-[1px]  w-[20%] lg-plus:w-[17.444%]'>

      {renderSharedProgressBar()}
      <div className='mt-2'>
        Updated {completedUpdates} of {totalUpdates} queries
        {updateErrors > 0 && <span className="ml-2 text-red-500">, with {updateErrors} error(s)</span>}
      </div>
    </div>
  )}




{showAddProgressBar && (
<>

<div className='   fixed bottom-[111px] m-2   p-[1rem] pt-[2rem] z-[1000] 
bg-white   right-[1px]  w-[20%]  lg-plus:w-[17.444%] '>
<AddProgressBar />
<div className='mt-2'>
        Added {completedAdds} of {totalAdds} queries
        {addErrors > 0 && <span className="ml-2 text-red-500">, with {addErrors} error(s)</span>}
      </div>
</div>
</>
)}

  





</div> 



                {isFolderSelected &&
                  <button
                    onClick={handleResetFilter}
                    className="flex items-center px-4 py-2 mb-4 font-bold text-white transition duration-150 ease-in-out rounded shadow bg-blue hover:bg-blue-700 r hover:shadow-lg"
                  >
                    <IoMdArrowBack className="mr-2" />
                    Back
                  </button>
                }
                <div className='flex justify-between'>
                  {selectedTargetUrl && (
                    <div className="mb-4 font-bold">
                      <h3 className="mb-2 ">Selected Target URL:
                        <span className="ml-2 text-blue-600">{selectedTargetUrl.label || selectedTargetUrl}</span>
                      </h3>
                    </div>
                  )}

                  <div>

                  </div>


                  {/* {isFolderSelected  && (
  <div className="mb-4 font-bold">
    <h3>Selected Bookmark Folder: <span className="text-blue">{selectedBookmarkFolderName}</span></h3>
  </div>
)} */}


                </div>
<div className='border-2 border-gray-200 rounded-lg'>


                <DataTable
                className=''
                  columns={columns}
                  data={filteredData}
                  pagination
                  highlightOnHover
                  striped
                  paginationPerPage={10}
                  customStyles={customStyles}
                  paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                  onRowClicked={handleRowClicked}
                  onChangeRowsPerPage={handlePerPageChange}
                  paginationComponentOptions={paginationOptions}
                  conditionalRowStyles={conditionalRowStyles}
                  noDataComponent={<NoDataComponent />}
                  expandableRows={hasRealData} // Only allow rows to be expandable if there is real data
                  expandOnRowClicked={hasRealData} // Only expand on row click if there is real data
                  expandableRowsComponent={hasRealData ? ({ data }) => renderAccordionContent(data) : null} // Provide expandable component only if there is real data
                  expandableIcon={hasRealData ? undefined : { collapsed: null, expanded: null }} // Hide expandable icon if no real data
                />

</div>

                {isFolderSelected && (

                  <BookmarkDetails bookmarkId={''} />




                )}
              </div>

              {/* <div className=' border-l-2 border-gray-200 z-[10000]'></div> */}



              {isSidebarOpen &&
                <BookmarkSidebar
                  isOpen={isSidebarOpen}
                  onClose={closeSidebar}
                  folderRanks={folderRanks}
                  averageRank={averageRank}

                />




              }







              <DragOverlay

                dropAnimation={null}
              >
                {draggedItem && (

                  <div className="my-drag-overlay text-md"
                    style={{
                      width: '300px',
                      backgroundColor: '#c7c6c5',
                      borderRadius: '10px',
                      textAlign: 'center',
                      padding: '5px',

                    }}
                  >
                    <div>{draggedItem.query}</div>
                  </div>
                )}



              </DragOverlay>
            </DndContext>
          </div>

        )}
      </div>

    </>
  );
};

export default DataTableComponent;


