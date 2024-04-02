import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchUrlData } from '../../../redux/lib/urlSearch';
import { useNavigate } from 'react-router-dom';
import { processKeyword, processQuery } from '../../../redux/lib/querySlice';

export function Search() {
  const [activeTab, setActiveTab] = useState("query"); // Changed "keyword" to "query"
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isKeywordLoading, setIsKeywordLoading] = useState(false);
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const { register: registerKeyword, handleSubmit: handleSubmitKeyword, reset: resetKeyword } = useForm();
  const { register: registerURL, handleSubmit: handleSubmitURL, reset: resetURL } = useForm();

  

  const onKeywordSubmit = (data) => {
    setIsKeywordLoading(true); // Start loading
    dispatch(processKeyword(data))
      .unwrap()
      .then(response => {
        // Save the response in local storage
        localStorage.setItem('keywordData', JSON.stringify(response));
        console.log("ٌRSPOONSE keyword",response)
  
        navigate('/keywordquery', { state: { keywordData: response } });
        toast.success("Keyword Processed Successfully");
      })
      .catch(error => {
        toast.error(`Please Add Valid Keyword`);
      })
      .finally(() => {
        resetKeyword();
        setIsKeywordLoading(false); // Stop loading
      });
  };

  
  const onURLSubmit = data => {
    setIsUrlLoading(true); // Start loading
    dispatch(fetchUrlData(data))
      .unwrap()
      .then(response => {
        localStorage.setItem('urlData', JSON.stringify(response));
        console.log("UrlResponse",response)
        navigate('/keywordresearch', { state: { urlData: response } });
        
      })
      .catch(error => {
        toast.error("please Add vaild Url ");
      })
      .finally(() => {
        resetURL();
        setIsUrlLoading(false); // Stop loading
      });
  };

  
  const tabsData = [
    {
      label: "Keyword",
      value: "query", 
      onSubmit: handleSubmitKeyword(onKeywordSubmit),
      register: registerKeyword,
      placeholder: "Enter Keyword...",
    },
    {
      label: "URL",
      value: "url",
      onSubmit: handleSubmitURL(onURLSubmit),
      register: registerURL,
      placeholder: "Enter URL...",
    }
  ];

  return (
    <Tabs value={activeTab} onChange={setActiveTab} className="px-10 ">
      <TabsHeader
        className="bg-transparent "
        indicatorProps={{
          className: "bg-blue/20  border-b rounded-none  border-blue !text-white shadow-none  z-[10]",
        }}
      >
        {tabsData.map(({ label, value }) => (
          <Tab 
            key={value} 
            value={value}
            className={`${activeTab === value ? 'bg-lightblue text-black' : 'bg-white'}`}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {tabsData.map(({ value, onSubmit, register, placeholder }) => (
          <TabPanel key={value} value={value}>
            <form onSubmit={onSubmit} className='mx-auto '>
              <input
                {...register(value)}
                required

                className="w-full p-2 border-b border-gray-300"
                placeholder={placeholder}
              />
              <div>
              <button
                  type="submit"
                  disabled={value === "query" ? isKeywordLoading : isUrlLoading}
                  className={`bg-blue w-full text-center mt-3
                    flex items-center justify-center rounded-md mx-auto text-white p-2 ${value === "query" && isKeywordLoading ? 'opacity-50' : ''} ${value === "url" && isUrlLoading ? 'opacity-50' : ''}`}
                >
                  {(value === "query" && isKeywordLoading) || (value === "url" && isUrlLoading) ? (
                    <>
                      <div className="mr-3 spinner"></div> Loading...
                    </>
                  ) : 'Submit'}
                </button>
              </div>
            </form>
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
