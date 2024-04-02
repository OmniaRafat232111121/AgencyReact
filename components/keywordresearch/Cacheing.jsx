

import React, { useState, useEffect } from 'react';
import { MdQueryStats } from "react-icons/md";

const Cacheing = () => {
  const [lastKeywordSearch, setLastKeywordSearch] = useState('');
  const [lastUrlSearch, setLastUrlSearch] = useState('');
  const [readableUrl, setReadableUrl] = useState('');

  useEffect(() => {
    const keywordResults = JSON.parse(localStorage.getItem('keywordResults'));
    const urlData = JSON.parse(localStorage.getItem('urlData'));

    if (keywordResults && keywordResults.length > 0) {
      setLastKeywordSearch(keywordResults[keywordResults.length - 1].query);
    }

    if (urlData && urlData.url) {
      setLastUrlSearch(urlData.url);

      // Extract the domain from the URL using a regex
      const domainMatch = urlData.url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
      if (domainMatch && domainMatch[1]) {
        setReadableUrl(domainMatch[1]); // Set readable URL to the domain part
      }
    }
  }, []);

  return (
    <div className='bg-gray-100 shadow   mr-[10px] group  hover:bg-blue hover:ring-blue  cursor-pointer
     text-blue  p-5 rounded-md space-y-4'>
      <h3 className='text-lg font-semibold  group-hover:text-white'>Cached Data</h3>
      {lastKeywordSearch ? (
       <>
        <div className='bg-white p-4 rounded-md shadow'>
          <h4 className=' group-hover:text-black font-bold'>Last Keyword Search:</h4>
    <pre className='text-blue font-semibold'>{lastKeywordSearch}</pre>
  

        </div>
        
       </>
      ) : <p>No keyword search data available.</p>}
      {lastUrlSearch ? (
        <div className='bg-white p-4 rounded-md shadow'>
          <h4 className='group-hover:text-black font-bold'>Last URL Search:</h4>
          <a href={lastUrlSearch} target="_blank" rel="noopener noreferrer" className='text-blue font-semibold hover:underline'>
            {readableUrl || lastUrlSearch} {/* Display the readable URL if available */}
          </a>
        </div>
      ) : <p>No URL search data available.</p>}
    </div>
  );
}

export default Cacheing;
