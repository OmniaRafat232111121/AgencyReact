import { HiMenuAlt1 } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import Profile from './Profile';
import { IoMdList } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { toggle_Bookmark } from '../redux/lib/SidebarSlice';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaDownload, FaPlus, FaUpload } from 'react-icons/fa'
import { useState } from 'react';
import axios from 'axios';
import ConfirmationDialogg from './Modal/ConfirmationDialogg';
const Navbar = ({ toggle, show }) => {
  const location = useLocation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const userId = pathSegments.length > 1 ? pathSegments[1] : null;
  const projectId = pathSegments.length > 2 ? pathSegments[2] : null;
  const isProjectDetailsPage = () => {
    const regex = /\/projects\/\d+\/\d+/;
    return regex.test(location.pathname);
  };
  const projectDetails = location.state?.projectDetails;
console.log(projectDetails)
  const navigate = useNavigate(); // Initialize useNavigate hook
  const dispatch = useDispatch()
  const goBack = () => navigate(-1);
  const tableData = useSelector((state) => state.tableSlice.data);
  //  const userId = useSelector(state => state?.authSlice?.id);

  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState(tableData);
  const isSidebarOpen = useSelector((state) => state.SidebarSlice.isOpen);

  const [isHover, setIsHover] = useState(false);
  const [is_Hover_, set_Is_Hover] = useState(false);
  const handle_Mouse_Enter = () => set_Is_Hover(true);
  const handle_Mouse_Leave = () => set_Is_Hover(false);

  const handleMouse_Enter = () => setIsHover(true);
  const handleMouse_Leave = () => setIsHover(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the Excel file directly
      await uploadFile(formData);
    } else {
      toast.error('Please select an Excel file.');
    }
  };
  const triggerFileInput = () => {
    document.getElementById('excelFileInput').click();
  };

  const fetchDataFromApi
    = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userRankExcel/${userId}/`);
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        toast.error(error)
      }
    };

  

  const uploadFile = async (formData) => {
    try {
      const uploadUrl = `${process.env.REACT_APP_API_URL}/api/upload/${userId}/${projectId}/`;

      const response = await axios.post(uploadUrl, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' ,
        },
      });
  console.log(response.data)
      if (response.status === 200 || response.status === 201) {
        const newData = response.data;
        setFilteredData(currentData => [...currentData, ...newData]);
        setShowConfirmDialog(true);


      } else {
        toast.error('Failed to import data');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    }
  };
  const refreshPage = () => {
    window.location.reload();
};

  return (
    <div className="fixed inset-0 flex items-center justify-between h-16 p-0 px-10 bg-white border-b-2 border-gray dark:bg-slate">
      {/* Welcome message */}
      <div className="flex ml-[12%] ">



        <button
          onClick={goBack}
          className="flex items-center justify-center p-2 text-center transition-colors duration-150 ease-in-out rounded-full text-blue hover:bg-gray-200 hover:text-black"
          aria-label="Go back">
          <MdArrowBack size={20} />
        </button>
        <button className='text-lg font-bold text-greeng'>
          {location.pathname === '/projects' && <span className="ml-2">All Projects</span>}
          {location.pathname === '/' && <span className="ml-2">All Data</span>}

        </button>
        {/* <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform cursor-pointer'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize'>project</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.name}</p>

              </div>

            </div>


            <div className='flex flex-row items-center justify-between p-4 transition duration-500 transform cursor-pointer'>
              <div>
                <span className='text-sm font-semibold text-gray-500 capitalize '>Url</span>
                <p className='font-bold capitalize text-md text-greeng'>{projectDetails?.url}</p>
              </div>

            </div> */}
      </div>
      <div className="md:hidden">
        {show ? (
          <MdClose
            size={30}
            className="text-2xl cursor-pointer relative right-[3.5rem] top-1 p-2"
            onClick={toggle}
          />
        ) : (
          <HiMenuAlt1
            className={`text-2xl cursor-pointer ${show ? 'bg-red-900' : ''}`}
            onClick={toggle}
          />
        )}

      </div>

      <div className="flex-1 " />



      

      <div className="flex items-center justify-end p-4">
    

        {isProjectDetailsPage() && (
          <>
          
            <button
              className="flex items-center justify-center px-4 py-2 mr-2 font-bold transition duration-150 ease-in-out bg-white rounded hover:bg-blue hover:text-white text-blue"
              onClick={() => document.getElementById('excelFileInput').click()}
            >
              <FaUpload className="mr-2" /> Import
            </button>

            <input
              type="file"
              id="excelFileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".xlsx, .xls"
            />
          </>
        )}

        

      </div>
      <ConfirmationDialogg
  isOpen={showConfirmDialog}
  onClose={() => setShowConfirmDialog(false)}
  onConfirm={() => {
    // Assuming you might want to perform any clean-up or state updates here
    setShowConfirmDialog(false); // Close the dialog first
    window.location.reload(); // Refresh the page
  }}
  message="The data has been uploaded. Do you want to refresh the page to see the new data?"
/>







      <div className='flex space-x-4'>


        <div onClick={() => dispatch(toggle_Bookmark())}
          className='mr-4  text-blue  lg-plus:hidden inline-flex absolute right-[85px] top-[20px]'
          style={{ cursor: 'pointer' }}>
          {isSidebarOpen ? <IoMdList size={25} /> : <IoMdList size={25} />}

        </div>


        {/* <DarkModeToggle/> */}
        <Profile />

      </div>
    </div>
  );
};

export default Navbar;
