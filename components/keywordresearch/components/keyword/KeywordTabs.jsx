import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import ContentKeyword from "./ContentKeyword";
import AltQuery from "./AltQuery";
import CaptionQuery from "./CaptionQuery";
import KeywordtableQuery from "./KeywordtableQuery"
import { toast } from "react-toastify";
  const KeywordTabs = () => {
  const keywordData = useSelector((state) => state.querySlice.data);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedTabResultsSample, setSelectedTabResultsSample] = useState([]);
  const [selectedTabAltSample, setSelectedTabAltSample] = useState([]);
  const [selectedTabTextContent, setSelectedTabTextContent] = useState([]);
  const [selectedCaptiontext, setSelectedCaptionText] = useState([]);

  const [selectedCount, setSelectedCount] = useState(0); // Add this state


  const extractNameFromUrl = (url) => {
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\..+$/, '');
  };

  // New function to generate unique tab names
  const generateUniqueTabNames = (data) => {
    const nameCount = {};
    return data.map(item => {
      const name = extractNameFromUrl(item.url);
      nameCount[name] = (nameCount[name] || 0) + 1;
      return nameCount[name] > 1 ? `${name}${nameCount[name]}` : name;
    });
  };

  const uniqueTabNames = generateUniqueTabNames(keywordData);

  const initialActiveTab = keywordData && keywordData.length > 0
    ? extractNameFromUrl(keywordData[0].url)
    : "";

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  useEffect(() => {
    if (keywordData && keywordData.length > 0) {
      const firstTabData = keywordData[0];
      console.log(firstTabData)
      setSelectedTabResultsSample(firstTabData.results_sample);
      setSelectedTabAltSample(firstTabData.alt_sample);
      setSelectedTabTextContent(firstTabData.text_content);
      setSelectedCaptionText(firstTabData.captions_text)

      setSelectedCount(firstTabData.count); 
      console.log(firstTabData.count)

    }
  }, [keywordData]); // 




  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
  
    const selectedKeywordData = keywordData.find(
      (item) => extractNameFromUrl(item.url) === keyword
    );
  
    if (selectedKeywordData) {
      setSelectedTabResultsSample(selectedKeywordData.results_sample);
      setSelectedTabAltSample(selectedKeywordData.alt_sample);
      setSelectedTabTextContent(selectedKeywordData.text_content);
      setSelectedCount(selectedKeywordData.count); 
      setSelectedCaptionText(selectedKeywordData.captions_text);
  
      // Log the results_sample array for the selected keyword
      console.log("results_sample for selected:", selectedKeywordData.results_sample);
    }
  };
  

  if (!keywordData || keywordData.length === 0) {
    return (
      <>
       <div className="flex flex-col items-center justify-center w-full h-10vh">
        <div className="p-4 bg-white border rounded ">
          No data Found
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <Tabs value={activeTab} 
      className="max-w-screen-xl mx-auto mt-[30px] 
       capitalize mt-[50px] z-[100]">
       
        <TabsHeader
          className="z-10 max-w-screen-lg p-0 mx-auto bg-transparent border-b rounded-none border-blue-gray-50"
          indicatorProps={{
            className:
              "bg-transparent border-b-2   border-blue shadow-none rounded-none ",
          }}
        >
          
          {keywordData.map((item, index) => (
            <Tab
            key={item.url}
            value={uniqueTabNames[index]}
            onClick={() => {
              setActiveTab(uniqueTabNames[index]);
              handleKeywordClick(uniqueTabNames[index]);
            }}
            className={activeTab === uniqueTabNames[index] ? "text-blue font-bold" : ""}
          >
       <div className="flex items-center space-around ">
       <div>
    

        </div>
        <div>
        {uniqueTabNames[index]}
        </div>
       </div>
          </Tab>
        ))}

        </TabsHeader>
        <TabsBody>
          {keywordData.map((item,index) => (
          
            <TabPanel key={item.url} value={uniqueTabNames[index]}>
             

                <div className="flex md:justify-between 
       space-x-[30px] mt-[2rem]
      max-w-screen-2xl mx-auto flex-col lg:flex-row">

                  <KeywordtableQuery
                    onKeywordClick={handleKeywordClick}
                    data={selectedTabResultsSample}
                  />


                  <ContentKeyword
                    selectedKeyword={selectedKeyword}
                    resultsSample={selectedTabResultsSample}
                    textContent={selectedTabTextContent}
                    count={selectedCount}
                  />



             
              </div>



              <div className=' justify-between 
      pt-0 space-x-[30px] mt-[1rem]
      flex  
      max-w-screen-2xl mx-auto  
      md:flex-col lg:flex-row
      '>
                <AltQuery
                  altData={selectedTabAltSample}
                />

                <CaptionQuery
                 textContent={selectedCaptiontext} />
              </div>


            </TabPanel>


          ))}
        </TabsBody>
      </Tabs>
    </>
  );
};

export default KeywordTabs;