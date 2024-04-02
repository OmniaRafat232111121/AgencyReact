import React, { useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

const ContentKeyword = ({ selectedKeyword, textContent, count }) => {
  console.log(count)
  const [highlightedContent, setHighlightedContent] = useState("");
  const [textDirection, setTextDirection] = useState("ltr");

  useEffect(() => {
    // Update text direction based on the language in the text content
    const determineTextDirection = () => {
      const combinedText = textContent?.join(" ") || "";
      const arabicWordCount = (combinedText.match(/[\u0600-\u06FF]+/g) || []).length;
      const englishWordCount = (combinedText.match(/[a-zA-Z]+/g) || []).length;
      setTextDirection(arabicWordCount > englishWordCount ? "rtl" : "ltr");
    };

    determineTextDirection();
  }, [textContent]);

  useEffect(() => {
    // Highlight selected keyword and append sequence numbers only to them, if selected
    const highlightAndSanitizeText = () => {
      const combinedText = textContent?.join("\n") || "";
      let processedText = combinedText;

      if (selectedKeyword && combinedText) {
        let occurrence = 0;
        const regex = new RegExp(`(${selectedKeyword})`, 'gi');
        processedText = combinedText.replace(regex, (match) => {
          occurrence += 1; // Increment the occurrence count only for selected keyword
          return `<span class="highlight">${match}</span><span class="occurrence-number">(${occurrence})</span>`;
        });
      }

      const safeText = sanitizeHtml(processedText, {
        allowedTags: ['span'],
        allowedAttributes: { 'span': ['class'] },
      });
      setHighlightedContent(safeText);
    };

    highlightAndSanitizeText();
  }, [textContent, selectedKeyword]);

  return (
    <div className={`mx-auto lg:w-[60%] md:w-full mt-[1rem] lg:mt-[0rem]
    shadow-none border-2 border-gray-200 rounded-2xl overflow-hidden
    `}>
      <div className={`sticky top-0 bg-blue-400 w-full rounded-2xl `}>
        <h1 className={`bg-white text-black py-[13.5px] px-2 font-semibold  border-black border-b-2
         mb-[10px] text-center mx-auto`}>
          Content for Keyword: {count}
        </h1>
      </div>
      <div className={`overflow-auto h-[500px]`} style={{ direction: textDirection }}>
        <div className={`px-[1rem] mt-[10px]`} dangerouslySetInnerHTML={{ __html: highlightedContent }} />
      </div>
    </div>
  );
};

export default ContentKeyword;
