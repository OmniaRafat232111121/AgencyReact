import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import sanitizeHtml from 'sanitize-html';

const ArticleContent = ({ selectedKeyword }) => {
  const [textContent, setTextContent] = useState("");
  const [highlightedContent, setHighlightedContent] = useState("");
  const [textDirection, setTextDirection] = useState("ltr");
  const urlData = useSelector(state => state.UrlSlice.data);
  console.log(urlData.url)

  useEffect(() => {
    if (urlData && urlData.text_content) {
      const combinedText = urlData.text_content.join("\n");
      setTextContent(combinedText);
    } else {
      setTextContent("");
    }
  }, [urlData]);

  useEffect(() => {
    const arabicWordCount = (textContent.match(/[\u0600-\u06FF]+/g) || []).length;
    const englishWordCount = (textContent.match(/[a-zA-Z]+/g) || []).length;
    setTextDirection(arabicWordCount > englishWordCount ? "rtl" : "ltr");
  }, [textContent]);

  const highlightKeywords = (text, keyword) => {
    if (!keyword) return text;
    let occurrence = 0;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, (match) => {
      occurrence += 1;
      return `<span class="highlight">${match}</span><span class="occurrence-number">(${occurrence})</span>`;
    });
  };

  useEffect(() => {
    if (!textContent) {
      return;
    }
    const highlightedText = highlightKeywords(textContent, selectedKeyword);
    const safeText = sanitizeHtml(highlightedText, {
      allowedTags: ['span'],
      allowedAttributes: { 'span': ['class'] },
    });
    setHighlightedContent(safeText);
  }, [textContent, selectedKeyword]);

  // Function to extract domain name from URL using regex
  const extractDomainName = (url) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    const match = url.match(regex);
    const domain = match ? match[1] : null;
    return domain ? domain.replace('.com', '') : null;
  };
  const domainName = extractDomainName(urlData.url);

  return (
    <div className={`mx-auto lg:w-[60%] md:w-full mt-[1rem] lg:mt-[0rem]
    border-2 border-gray-200 rounded-2xl overflow-hidden
    `}>
      <div className={`sticky top-0 bg-blue-400  w-full`}>
      <h1 className={`bg-white text-black border-black border-b-2  py-[13.5px] px-2 font-semibold mb-[10px] text-center mx-auto`}>
      <a href={urlData.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold capitalize ">
        {domainName}
      </a> - {urlData.count} word 
    </h1>
      </div>
      <div className={`overflow-auto h-[500px]`} style={{ direction: textDirection }}>
        <div className={`px-[1rem] mt-[10px]`} dangerouslySetInnerHTML={{ __html: highlightedContent }} />
      </div>
    </div>
  );
};

export default ArticleContent;
