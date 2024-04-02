

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function SimpleModal({ isOpen, onClose, onProjectCreated, existingProjectNames }) {
  const [projectName, setProjectName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef();
  const userId = useSelector(state => state?.authSlice?.id);

  const resetForm = () => {
    setProjectName('');
    setTargetUrl('');
    setError(''); // Reset error state as well
  };
  const validateUrl = (url) => {
    // Basic URL validation
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  };
  
  // const handleCreation = async () => {
  //   if (existingProjectNames.includes(projectName.trim())) {
  //     setError('Project name already exists.');
  //     return;
  //   }
  //   let formattedUrl = targetUrl.trim();

  //   try {
  //     const urlObject = new URL(formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://') ? formattedUrl : `http://${formattedUrl}`);
  //     // Extract hostname (domain) and remove 'www.' if present
  //     formattedUrl = urlObject.hostname.replace(/^www\./, '');
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/projects/${userId}/`, {
  //       name: projectName,
  //       url: formattedUrl,
  //     });
  //     onProjectCreated(response.data);
  //     onClose();
  //     resetForm(); // Reset form on successful creation
  //   } catch (error) {
  //     console.error(error.response || error.message);
  //     setError(error.response?.data?.message || 'An error occurred.');
  //     if (error.response?.data?.message.includes('Project name')) {
  //       // Reset form if there's a specific error related to project name
  //       setProjectName('');
  //       setTargetUrl('');
  //     }
  //   }
  // };

  const handleCreation = async () => {
    if (existingProjectNames.includes(projectName.trim())) {
      setError('Project name already exists.');
      return;
    }
  
    const isValidUrl = (url) => {
      const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
                                     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
                                     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!urlPattern.test(url);
    };
  
    let formattedUrl = targetUrl.trim();
    if (!isValidUrl(formattedUrl)) {
      setError('Please enter a valid URL.');
      return;
    }
  
    try {
      const urlObject = new URL(formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://') ? formattedUrl : `http://${formattedUrl}`);
      // Extract hostname (domain) and remove 'www.' if present
      formattedUrl = urlObject.hostname.replace(/^www\./, '');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/projects/${userId}/`, {
        name: projectName,
        url: formattedUrl,
      });
      onProjectCreated(response.data);
      onClose();
      resetForm(); // Reset form on successful creation
    } catch (error) {
      console.error(error.response || error.message);
      setError(error.response?.data?.message || 'An error occurred.');
      if (error.response?.data?.message.includes('Project name')) {
        // Consider not resetting form here as it removes user input, making correction harder
      }
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      resetForm(); // Reset form whenever the modal is opened
    }

    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
  
    <div ref={modalRef} 
    className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-greeng bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300">
    {/* Modal content */}
    <div className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="flex flex-col gap-4 p-6">
        {/* Input fields and Create Project button */}
        <input
          className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md outline-none peer border-blue-gray-200 text-blue-gray-700 focus:border-2 focus:border-gray-900"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
         {/* {error && <div className="text-red-500">{error}</div>} */}
        <input
          className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md outline-none peer border-blue-gray-200 text-blue-gray-700 focus:border-2 focus:border-gray-900"
          placeholder="Target URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />

        <select
          className="w-full h-full px-3 py-1 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md outline-none peer border-blue-gray-200 text-blue-gray-700 focus:border-2 focus:border-gray-900"
          id="country"
          defaultValue=""
          placeholder="country"

        >
          <option value="" disabled>Select Country</option>
          <option value="eg">Egypt</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </select>


        {error && <div className="text-red-500">{error}</div>}


        <div className='flex space-x-4'>
        <button
            className="block select-none rounded-lg w-[50%]
          bg-gradient-to-tr bg-red-500  py-3 px-6 
          text-center align-middle font-sans text-xs font-bold uppercase text-white 
          shadow-md shadow-gray-900/10 transition-all hover:shadow-lg 
          hover:shadow-gray-900/20 active:opacity-[0.85]"
            type="button"
            onClick={onClose}>Close</button>
            
          <button
            className="block select-none rounded-lg w-[50%]
          bg-gradient-to-tr bg-blue  py-3 px-6 
          text-center align-middle font-sans text-xs font-bold uppercase text-white 
          shadow-md shadow-gray-900/10 transition-all hover:shadow-lg 
          hover:shadow-gray-900/20 active:opacity-[0.85]"
            type="button"
            onClick={handleCreation}>Create Project</button>

          
        </div>
      </div>

    </div>
  </div>
  );
}

export default SimpleModal;
