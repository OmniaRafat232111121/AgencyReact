import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { selectLastFiveQueries } from '../../redux/lib/quoriesSlice';

const QueriesDisplay = () => {
  const lastFiveQueries = useSelector(selectLastFiveQueries);

  // Define columns for DataTable
  const columns = [
    {
      name: 'Query',
      selector: row => row.query,
      sortable: true,
    },
    {
      name: 'Rank',
      selector: row => row.rank,
      sortable: true,
    },
  ];

  // DataTable component accepts an array of objects as data
  const data = lastFiveQueries.map((query, index) => ({
    id: index, // Adding an id for key prop
    query: query.query,
    rank: query.rank,
  }));
 // Define customStyles to adjust row height
 const customStyles = {
  rows: {
    style: {
      height: '10px', // override the row height
    },
  },
};
  return (
    <div className="  
     rounded-lg  overflow-hidden 
   lg:w-[50%] w-[100%]  mt-5 p-2">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Last 5 Queries</h2>
      <DataTable
        columns={columns}
        data={data}
        noHeader
        defaultSortFieldId={2} // Assuming you want to sort by the 'Date' column by default
        defaultSortAsc={false}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}

      />
    </div>
  );
};

export default QueriesDisplay;
