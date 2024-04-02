import React from 'react';
import { useSelector } from 'react-redux';

const AltTable = () => {
  const urlData = useSelector(state => state.UrlSlice.data);

  if (!urlData || !urlData.alt_sample) {
    return null;
  }

  return (
    <div className=" mx-auto lg:w-[80%] md:w-full md:mt-[1rem] text-center border-2 border-gray-200 rounded-2xl
 overflow-auto">
      <table className="min-w-full text-left table-auto">
        <thead className="text-black bg-white border-b-2 border-black">
          <tr>
            <th className="px-4 py-2">Alt</th>
            <th className="px-4 py-2">Count</th>
          </tr>
        </thead>
        <tbody>
          {urlData.alt_sample.map((item, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="px-4 py-2">{item.alt}</td>
              <td className="px-4 py-2">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AltTable;
