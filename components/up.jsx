


import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/lib/fetchData';
import { FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import ClipLoader from "react-spinners/ClipLoader";
import { ImSpinner11 } from "react-icons/im";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteRank } from '../redux/lib/deleteRow'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { keywordschema } from '../utils/validation';
import { addKeyword } from '../redux/lib/keyword';
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
import { addsingleKeyword } from '../redux/lib/singlekeyword';
import { FaStar } from "react-icons/fa";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import styles if using a library
import { IoIosArrowDown,IoIosArrowUp } from "react-icons/io";


const DataTableComponent = ({ }) => {
 
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [updateProgress, setUpdateProgress] = useState([]);
  const [showUpdates, setShowUpdates] = useState(false);


  const toggleDropdown = (query_id) => {
    setActiveDropdown(activeDropdown === query_id ? null : query_id);
  };
  const [folderRanks, setFolderRanks] = useState({});
  const [averageRank, setAverageRank] = useState( ); 
  const [isPopupVisible, setIsPopupVisible] = useState(true);

   const tabsRef = useRef(null);

  
  const [isItemDropped, setIsItemDropped] = useState(false);
  const [isSidebarOpenn, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const [isModal_Open, setIsModal_Open] = useState(false);
  //  const open_Modal = () => setIsModal_Open(true);
  const open_Modal = () => {
    setIsModal_Open(true);
    setSearchQuery(""); // Add this line to clear the search query
  };
  

  
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
  const [updatingRows, setUpdatingRows] = useState(new Set());

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const userId = useSelector(state => state?.authSlice?.id);
 
  const dispatch = useDispatch();
  const tableData = useSelector((state) => state.tableSlice.data);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetUrl, setSelectedTargetUrl] = useState('All Sources'); 
  const [loading, setLoading] = useState(true);
  const animatedComponents = makeAnimated();
  const [dataFetched, setDataFetched] = useState(false);
  const [queryInfo, setQueryInfo] = useState(null);
  const [filteredData, setFilteredData] = useState(tableData);


  const hasRealData = filteredData.some(row => !row.noDataIndicator);

  const [activeTab, setActiveTab] = useState("single"); // Changed "keyword" to "query"
  
  const customStyles = {
    headCells: {
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#ba9934',
      },
    },
  };
  const [isSubmitting, setIsSubmitting] = useState(false);


  const locationOptions = [
    { value: 'US', label: 'USA', icon: <img src={USA} alt="USA" /> },
    { value: 'EG', label: 'Egypt', icon: <img src={EGYPT} alt="Egypt" /> },
    { value: 'AE', label: 'Dubai ', icon: <img src={AE} alt="dubai" /> },
  ];

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };
 
  

  
  
  

  


  const updateFilteredData = useCallback(() => {
    let filteredResult = [...tableData];
  
  
    // Apply search query filter
    if (searchQuery) {
      const queryRegex = new RegExp(searchQuery, 'i');
      filteredResult = filteredResult.filter(
        (item) => item.query.match(queryRegex) || item.query.includes(searchQuery)
      );
    }
  
    // Apply target URL filter only if a specific URL is selected (and not "All Sources")
    if (selectedTargetUrl && selectedTargetUrl !== 'All Sources') {
      filteredResult = filteredResult.filter((item) =>
        item.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '') === selectedTargetUrl
      );
    }
  
    // Apply location filter
    if (selectedLocationFilter !== 'All Locations') {
      filteredResult = filteredResult.filter((item) =>
        item.google_domain === selectedLocationFilter
      );
    }
  
    // Sort the array in descending order based on the date
    filteredResult.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    // Check if the filtered results array is empty after all filters are applied
    if (filteredResult.length === 0) {
      setFilteredData([{ noDataIndicator: true }]);
    } else {
      setFilteredData(filteredResult);
    }
  
  }, [searchQuery, selectedTargetUrl, selectedLocationFilter, tableData, selectedBookmark]);
  


  const NoDataComponent = () => (
    <div className="text-center" style={{ padding: '20px', gridColumn: '1 / -1' }}>
      No data
    </div>
  );
  
 

  useEffect(() => {
    if (!dataFetched) {
      setLoading(true);
      dispatch(fetchData(selectedTargetUrl))
        .then(() => {
          setLoading(false);
          setDataFetched(true);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [dataFetched, dispatch, selectedTargetUrl]);
  
  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    updateFilteredData();
  }, [searchQuery, selectedTargetUrl, tableData]);

  const uniqueTargetUrls = [
    'All Sources',
    ...new Set(tableData.map((item) => item.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')))
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
  
  // Include the query name when initializing progress
  setUpdateProgress(prev => ({ ...prev, [query_id]: { progress: 0, queryName: query } }));

 
  const targetProgress = Math.floor(Math.random() * (91 - 80) + 80);

  let interval = setInterval(() => {
    setUpdateProgress(prev => {
      const currentInfo = prev[query_id];
  
      // Check if the current progress is less than the randomly generated target progress
      if (currentInfo.progress < targetProgress) {
        // Calculate the next progress step without exceeding the target
        const nextProgress = Math.min(currentInfo.progress + 10, targetProgress);
        return { ...prev, [query_id]: { ...currentInfo, progress: nextProgress } };
      } else {
        clearInterval(interval); // Stop the interval when reaching or exceeding the target progress
        return prev;
      }
    });
  }, 1000);
  try {
    // Your existing update logic
    setUpdatingRows(prev => ({ ...prev, [query_id]: true }));
    setIsUpdating(true);
    
    // Simulate an API call for updating
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/update-rank/${userId}/${query}/${targetUrl}/${google_domain}/`, {});

    if (response.status === 200) {
      clearInterval(interval); // Immediately set progress to 100%
      setUpdateProgress(prev => ({ ...prev, [query_id]: { ...prev[query_id], progress: 100 } }));
      toast.success(`${query} Update successful`);
    } else {
      toast.error('Update failed');
    }
  } catch (error) {
    console.error('Error updating rank:', error);
    toast.error('An error occurred while updating the rank.');
  } finally {
    setUpdatingRows(prev => ({ ...prev, [query_id]: false }));
    setIsUpdating(false);
  }
};

const DraggableRow = ({ item, children, ...props }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: `draggable-${item.query_id}`,
      data: item,
    });
    return (
      <div ref={setNodeRef}  {...listeners} {...attributes} {...props}>
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
  };

  
  useEffect(() => {
    // Select the first header element in the DataTable and change its text
    const firstHeader = document.querySelector(".rdt_TableHeadRow div");
    if (firstHeader) {
      firstHeader.innerText = "Details";
    }
  }, []); 



  const columns = [

    {
      name: 'keywords',
      maxWidth: '20%',

      sortable: true,
      selector: (row) => row.query,

      cell: (row) => (
         row.noDataIndicator ? <div className="text-center" colSpan="6">  </div> :    
          <DraggableRow item={row}>
            
        {row.query} 
      </DraggableRow>

        
     ),
    },

   
    {
      name: 'Rank',
      maxWidth: '5%',
      sortable: true,
      selector: (row) => row.rank,
      cell: row => {
        if (row.noDataIndicator) {
          return null; // Do not display anything if there's an indicator for no data
        }
        const differenceColor = row.rankDifference > 0 ? 'green' : row.rankDifference < 0 ? 'red' : 'grey';
        return (
          <div className="relative text-center ">
        {row.rankDifference !== 0 && (
          <div className={`absolute top-[-10px] right-[-17px]`} style={{ fontSize: '0.8em', color: differenceColor }}>
            {row.rankDifference > 0 ? `+${row.rankDifference}` : row.rankDifference}
          </div>
        )}
            <DraggableRow item={row}>
            <div>{row.rank}</div>

            </DraggableRow>
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
      <DraggableRow item={row}>


      <div className='flex justify-between items-center'>
        <span>{row.best_rank}</span>
     
      </div>
      
      </DraggableRow>

    },  

  
    {
      name: 'Date',
      maxWidth: '20%',
      selector: row => row.date,
      cell: row => row.noDataIndicator ? 'No data Found' : 
      <DraggableRow item={row}>

      <div>{format(new Date(row.date), 'dd MMM yyyy')}</div>
      </DraggableRow>
    },
    
    

   
    
    {
      name: 'Location',
      sortable: true,
      maxWidth: '20%',

      selector: (row) => row.google_domain,
      cell: (row) => (
        <DraggableRow item={row}>

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
        </DraggableRow>
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
            <DraggableRow item={row}>

            <div>
              Arabic URL: {row.source_url}
            </div>

</DraggableRow>


          );
        } 
        else {
          // Regular expression for the last part of the URL
          const regex = /\/([^\/]*)\/?$/;
          const matches = row.source_url.match(regex);
          const lastSegment = matches && matches[1] ? decodeURIComponent(matches[1]) : '';
    
          if (lastSegment) {
            return (
              <div className="tooltip-container   ">
               <span className="tooltip-text ">{decodeURIComponent(row.source_url)}</span>
                <br/>
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
          <BiDotsVertical  size={18} className='cursor-pointer ' />
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
    z-10 p-2 top-[0px]  w-[105px]
    bg-white rounded-lg shadowmenu">

              {/* Update Button */}
              <Menu.Item>
                {({ active }) => (
                     <div className='p-2  '>

                  <button
                    onClick={(e) => handleUpdateButtonClick(e, row.query_id, row.query, row.target_url, row.google_domain)}
                className={`  rounded-lg flex items-center   ${updatingRows[row.query_id] ? 'cursor-not-allowed' : ''}`}
                  >
                    {updatingRows[row.query_id] ? (
                      <ClipLoader size={12} color={'green'} loading={true} />
                    ) : (
                      <ImSpinner11 className=" hover:text-blue-600  mr-2"/>
                    )}
                                       <span className=' ml-[5px]  text-sm'>  Update</span>

                  </button>

                  </div>
                )}
              </Menu.Item>

              {/* Delete Button */}
              <Menu.Item>
                {({ active }) => (
                     <div className='p-2   '>

                  
                  <button
                    onClick={() => handleDeleteButtonClick(row.query_id)}
                    className=" rounded-lg flex items-center  justify-around "
                  >
                    <FaTrash className=" hover:text-blue-600  mr-2"/>
                    <span className=' ml-[5px]  text-sm'>  Delete</span>

                  </button>

                  </div>
                )}
              </Menu.Item>

              {/* View Button */}
              <Menu.Item>
                {({ active }) => (
                                       <div className=' p-2  '>

                
      <Link   className='text-slate-500 rounded-lg flex items-center' 
      to={`/details/${userId}/${encodeURIComponent(row.query)}/${encodeURIComponent(row.target_url)}/${row.google_domain}`}>
      <FaArrowsToEye className=" hover:text-blue-600  mr-2" />
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
    setSelectedTargetUrl(selectedOption ? selectedOption.value : '');
  };
  
  const { handleSubmit, control, register, reset, formState: { errors } } = useForm({
    resolver: zodResolver(keywordschema),
  });


  const onSingleSubmit = (data) => {
    console.log("single submit data:", data);
    if (isSubmitting) return;
        setIsSubmitting(true);
        setIsAdding(true);
      const keywordData = {
        query: data.keyword,
        target_url: data.singleurl,  // This should match your input field's name
        google_domain: selectedLocation?.value,
      };
        console.log("Submitting single keyword data:", keywordData); // Debug log
        dispatch(addsingleKeyword(keywordData))
        .unwrap()
        .then((response) => {
          console.log('Success:', response);
          console.log(queryInfo)
          toast.success('Keyword added successfully!');
          setQueryInfo({
            keywords: data.keyword,
            targetUrl: data.url,
            rank: response[0].rank,
            location: selectedLocation?.label,
          });
          console.log('Location:', selectedLocation?.value)
          console.log('queryInfo:', queryInfo);
          reset({ keywords: '', url: '' });
          dispatch(fetchData());
          // Close the modal here
          close_Modal();  // Call the function to close the modal
        })
        .catch((error) => {
          console.error('Error adding keyword:', error);
          toast.warning(`:warning: Sorry, keyword not existent !`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 7000,
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
  };




const onBulkSubmit = async (data) => {
  setIsDataLoading(true); 
  close_Modal();
  if (isSubmitting) return;
  setIsSubmitting(true);
  setIsAdding(true);
  reset({ keywords: '', url: '' });

  const currentDate = new Date();
  const queries = data.keywords.split('\n').map(line => line.trim()).filter(line => line);

  // Add temporary rows for each query with a 'Loading...' state
  const tempKeywordData = queries.map(query => ({
    query,
    target_url: data.url,
    google_domain: selectedLocation?.value,
    temp: true,
    date: currentDate,
    rank: 'Loading...',
    origin: 'Loading...'
  }));

  setFilteredData(currentData => [...tempKeywordData, ...currentData]);
  
  // Process each query and update its status
  for (const query of queries) {
    try {
      const keywordData = {
        query,
        target_url: data.url,
        google_domain: selectedLocation?.value,
      };

      const response = await dispatch(addKeyword(keywordData)).unwrap();

      if (Array.isArray(response) && response.length > 0) {
        const rank = response[0][0].rank;
        const originData = response[0][0].source_url;

        setFilteredData(currentData => {
          return currentData.map(item => {
            if (item.temp && item.query === query) {
              // Update row with actual data
              return { ...item, rank: rank, source_url: originData, temp: false };
            }
            return item;
          });
        });
        toast.success(`"${query}" added successfully with rank: ${rank}`);
      } else {
        throw new Error('Invalid response format or no data returned for query: ' + query);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      // Update the status of failed queries
      setFilteredData(currentData => {
        return currentData.map(item => {
          if (item.temp && item.query === query) {
            return { ...item, rank: 'Error', origin: 'Error', temp: false };
          }
          return item;
        });
      });
    }
  }

  setIsSubmitting(false);
  setIsAdding(false);
  setIsDataLoading(false);
  setHasSubmitted(true);

};


 
  const handleDragStart = (event) => {
    const { active } = event;
    const item = tableData.find((data) => `draggable-${data.query_id}` === active.id);

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
  const totalRows = tableData.length; // Assuming tableData is your dataset
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


  const tabsData = [
    // {
    //   label: "Single Keyword",
    //   value: "single",
    //   formFields: [
    //     { name: "keyword", placeholder: "Enter single keyword", type: "input" },
    //     { name: "singleurl", placeholder: "Add URL", type: "input" },
    //     { name: "singlelocation", placeholder: "Select Location", type: "select" }
    //   ],
    //   submitHandler: onSingleSubmit // Define this function
    // },
    {
      label: "Single Or Bulk Keywords",
      value: "bulk",
      formFields: [
        { name: "keywords", placeholder: "Enter Single or Bulk keywords", type: "textarea" },
        { name: "url", placeholder: "Add URL", type: "input" },
        { name: "location", placeholder: "Select Location", type: "select" }
      ],
      submitHandler: onBulkSubmit // Define this function
    }
  ];

  
  const closePopup = () => {
    setIsPopupVisible(false);
    // if (!urlData) {
    //   navigate(-1);
    // }
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
    const timer = setTimeout(() => {
      // Check for completed updates and remove them
      setUpdateProgress(prev => {
        return Object.entries(prev).reduce((acc, [queryId, { progress, queryName }]) => {
          if (progress < 100) {
            // Keep entries that are not yet completed
            acc[queryId] = { progress, queryName };
          }
          return acc;
        }, {});
      });
    }, 1000); // Adjust timing as needed
  
    return () => clearTimeout(timer); // Cleanup on unmount or when the effect re-runs
  }, [updateProgress]);


  


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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-0 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg
                 bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
option.icon && <span className="mr-2 w-6">{option.icon}</span>}
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
      {
  (filteredData && filteredData.length > 0) && (
    <div className="flex flex-wrap justify-between mb-4 -mx-2">

      <div className="p-4 w-full md:w-[28.33%] px-2">
        <label className="block text-lg mt-3 mb-1">Search for keyword</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
         
          <input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={handleSearchInputChange}
  className="pl-10 pr-4 h-[39px] border font-semibold rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
/>

        </div>
      </div>

     

<div className="p-4 w-full md:w-[28.33%] px-2">
  <label className="block text-lg mt-3 mb-1">Filter by Target URL</label>
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
            

            <button  
  onClick={open_Modal}
  className="w-full flex items-center justify-center mr-2 mt-[35px] bg-blue 
  tex-white p-3 rounded transition duration-150 ease-in-out lg:text-sm text-xs font-bold"
>
 <span className='flex space-x-2 '>
 <FaPlus className="lg:mr-2 text-white " /> 
 <p className='lg-plus:hidden inline text-white font-semibold '>Query</p>
 </span>
  <span className="hidden lg-plus:inline text-white">Add New Query</span>
</button>

    </div>
    </div>
  )
}

 <div 
      className='update-query px-3 transition  ' 
      style={{ bottom: showUpdates ? '0' : '-176px' }} // Dynamically set bottom based on showUpdates
    >
      <div 
        className='flex justify-between border-b-2 border-gray-200 pb-3 absolute w-[95%] z-[10000] bg-white p-3 top-0 cursor-pointer' 
        onClick={() => setShowUpdates(!showUpdates)}
      >
        {showUpdates ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
        <p>Updates ({Object.keys(updateProgress).length})</p>
      </div>

      {showUpdates && Object.entries(updateProgress).map(([queryId, { progress, queryName }]) => (
        <div key={queryId} className='flex items-center justify-between w-full px-4' style={{ margin: '10px 0', }}>
          <div style={{ width: 45, height: 50, flexShrink: 0 }}>
            <CircularProgressbar value={progress} text={`${progress}%`} />
          </div>
          <span>{queryName}</span>
        </div>
      ))}
    </div>
        {loading && isUpdating ? (
          <><>
            
          </>
          <div className="text-center">
              <ClipLoader
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader" />
            </div></>
        ) : (
          <div className=" p-0 lg-plus:p-4 mt-4 flex border-t-2 border-gray-200 ">



         <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
       
         {/* <div className='moo   overflow-auto  w-[70%]  lg-plus:w-[85%] p-4 '> */}
         <div className={`moo overflow-auto pr-[2.5rem] p-4 ${isSidebarOpen ? 'w-[70%] lg-plus:w-[80%]' : 'w-[100%]'}`}>

         {selectedTargetUrl && (
  <div className="mb-4">
    <h3 className="font-semibold mb-2">Selected Target URL: {" "}
    <span className="m-0">{selectedTargetUrl.label || selectedTargetUrl}</span>

    </h3>
  
  </div>
)}
      



<DataTable
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

<div className=' border-l-2 border-gray-200 '></div>



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
                <div className="my-drag-overlay"
                  style={{
                    width: 150,
                    backgroundColor: 'gray',
                    borderRadius: '10px',
                    textAlign: 'center'
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














