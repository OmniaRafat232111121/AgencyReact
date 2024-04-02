import React, { useState, useEffect } from 'react';

const RankRange = ({ queries }) => {
  const [rangeData, setRangeData] = useState({
    "1-3": { count: 0, percentage: 0 },
    "4-10": { count: 0, percentage: 0 },
    "11-20": { count: 0, percentage: 0 },
    "21-50": { count: 0, percentage: 0 },
    "51+": { count: 0, percentage: 0 },
  });

  useEffect(() => {
    const rangeCounts = {
      "1-3": 0,
      "4-10": 0,
      "11-20": 0,
      "21-50": 0,
      "51+": 0
    };

    // Count queries in each range
    queries.forEach(query => {
        const rank = query.rank;
        if (rank >= 1 && rank <= 3) rangeCounts["1-3"]++;
        else if (rank >= 4 && rank <= 10) rangeCounts["4-10"]++;
        else if (rank >= 11 && rank <= 20) rangeCounts["11-20"]++;
        else if (rank >= 21 && rank <= 50) rangeCounts["21-50"]++;
        else if (rank >= 51) rangeCounts["51+"]++;
      });

      const totalQueries = queries.length;
      const calculatedRangeData = {};
      Object.keys(rangeCounts).forEach(range => {
        calculatedRangeData[range] = {
          count: rangeCounts[range],
          percentage: totalQueries > 0 ? Math.round((rangeCounts[range] / totalQueries) * 100) : 0
        };
      });
    
      setRangeData(calculatedRangeData);
    }, [queries]);  

  // Function to return the color based on the range
  const getRangeColorClass = (range) => {
    switch (range) {
      case "1-3": return "bg-green-600";
      case "4-10": return "bg-green-400";
      case "11-20": return "bg-yellow-400";
      case "21-50": return "bg-red-400";
      case "51+": return "bg-red-600";
      default: return "bg-gray-800";
    }
  };
  const totalCount = Object.values(rangeData).reduce((acc, { count }) => acc + count, 0);
  const totalPercentage = Object.values(rangeData).reduce((acc, { percentage }) => acc + parseFloat(percentage), 0).toFixed(2);


  return (
    <div className="flex flex-col justify-between p-4 bg-white rounded ">
    <h2 className="mb-2 text-lg font-semibold text-gray-700">Query Rank Ranges</h2>
   
    <ul className="flex flex-col list-none space-y-1 mt-[20px]">
      {Object.entries(rangeData).map(([range, data]) => (
        <li 
          key={range}
          className={`flex justify-between px-3 py-2 rounded-lg text-sm text-gray-700
          
          `}
        >
          <div className="flex justify-between font-medium ">
            <div className={`inline-block w-3 h-3 mr-2 rounded-full ${getRangeColorClass(range)}`}></div>
            {range}
          </div>
          <div className="flex space-x-4 font-normal">

          <div>
          {data.percentage}%
          </div>
       
        
<div className='font-bold '>
({data.count})
</div>         

          </div>
         
        </li>
      ))}
    </ul>
  </div>
  );
};

export default RankRange;