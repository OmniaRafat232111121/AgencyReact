
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const KeywordtableQuery  = ({ data, onKeywordClick }) => {
  const [activeKeyword, setActiveKeyword] = useState(null);

  const handleKeywordClick = (keyword) => {
    console.log("Keyword clicked:", keyword);
    const newActiveKeyword = activeKeyword === keyword ? null : keyword;
    setActiveKeyword(newActiveKeyword);
    if (onKeywordClick) {
      onKeywordClick(newActiveKeyword);
    }
  };

  const columns = [
    {
      name: 'Keyword',
      selector: row => row.keyword,
      cell: (row) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleKeywordClick(row.keyword)}
          className={activeKeyword === row.keyword ? 'active-keyword' : ''}
        >
          {row.keyword}
        </div>
      ),
      sortable: true,
      minWidth: '70%',
      sortIcon: <div style={{ display: 'content' }}>▲▼</div>, // Custom sort icon
      sortFunction: (rowA, rowB) => rowA.keyword.localeCompare(rowB.keyword), 
      },
    {
      name: 'Count',
      selector: row => row.count,

      sortable: true,
      minWidth: '15%',
      cell: (row) => <div  className='mx-auto text-center '>{row.count}</div>, 
      sortIcon: <div style={{ display: 'inline' }}>▲▼</div>, // Custom sort icon
      sortFunction: (rowA, rowB) => rowA.count - rowB.count, // Custom sort function
    },
    {
      name: 'Avg',
      selector: row => row.avg,
      sortable: true,
      minWidth: '15%', 
      cell: (row) => <div  className='mx-auto text-center '>
        {row.avg} % </div>, 
      sortIcon: <div style={{ display: 'inline' }}>▲▼</div>, // Custom sort icon
      sortFunction:(rowA,rowB)=>rowA.avg-rowB.avg,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#ba9934',
        color: '#fff',
        fontSize: 'text-base',
      },
    },
    cells: {
      style: {
        fontSize: 'text-base',
        paddingLeft: '10px', 
      },
    },
  };

  return (
    <div className=" mx-auto  border-2 border-gray-200 rounded-2xl
    lg:w-[40%] md:w-full">
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        noHeader
      />
    </div>
  );
};

export default KeywordtableQuery ;
