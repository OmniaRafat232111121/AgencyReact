import React, { useState } from "react";
import KeywordsTable from "./KeywordsTable";
import ArticleContent from "./ArticleContent";
import { useSelector } from "react-redux";

const CompanyTabs = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const urlData = useSelector(state => state.UrlSlice.data);

  // Function to extract domain name from URL using regex
  const extractDomainName = (url) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    const match = url.match(regex);
    const domain = match ? match[1] : null;
    return domain ? domain.replace('.com', '') : null;
  };

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
  };

  if (!urlData) {
    return <div>Loading...</div>;
  }

  const domainName = extractDomainName(urlData.url);

  return (
    <>
        
      

      <div className="flex md:justify-between mt-[2rem]
       px-[100px] space-x-[30px] border-2 border-gray-200 rounded-2xl
      max-w-screen-2xl mx-auto flex-col lg:flex-row">

        {urlData && (
          <>
            <KeywordsTable 
              onKeywordClick={handleKeywordClick}
              data={urlData.results_sample}
            />
            <ArticleContent
              selectedKeyword={selectedKeyword}
            />
          </>
        )}
      </div>
      
    </>
  );
};

export default CompanyTabs;
