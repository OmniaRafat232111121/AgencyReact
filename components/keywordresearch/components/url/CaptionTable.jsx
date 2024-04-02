
import React from 'react';
import { useSelector } from 'react-redux';
const CaptionTable = () => {
    
  const urlData = useSelector(state => state.UrlSlice.data);

  return (
    
    <div className="overflow-x-auto mx-auto border-2 border-gray-200 rounded-2xl
    lg:w-[80%] md:w-full md:mt-[1rem] text-center  overflow-auto">

      <table className="min-w-full text-left table-auto">
        <thead className="text-black bg-white border-b-2 border-black">
          <tr>
            <th className="px-4 py-2">Caption Text</th>
          </tr>
        </thead>
        <tbody>
             {urlData && urlData.captions_text.map((caption, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="px-4 py-2">{caption}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaptionTable;
