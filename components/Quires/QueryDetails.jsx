import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { ClipLoader } from 'react-spinners';
import Chart from 'react-apexcharts';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
const QueryDetails = () => {
  const { queryId, queryName,targetUrl  } = useParams();
  const decodedTargetUrl = decodeURIComponent(targetUrl);

  console.log('userId:', queryId);
  console.log('queryName:', queryName);
  console.log('targetUrl:', decodedTargetUrl);

  const queryNameFromUrl = 'Sample Query Name';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('day'); // Default filter type is 'day'
  const [filterInput, setFilterInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const chartRef = useRef(null);

 

  const columns = [
    {
      name: 'Date',
      selector: 'date',
      sortable: true,
      cell: (row) => (
        <span>{format(parseISO(row.date), 'MMM. d, yyyy')}</span>
      ),
    },
    {
      name: 'Rank (Win)',
      selector: 'rank_win',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: () => (
        <div>
          <button className="text-red-500 
       px-2 py-1 rounded-lg border border-red-500 ml-2 hover:bg-red-500
        hover:text-white transition-all ease-in-out duration-300">
            Delete
          </button>
        </div>
      ),
    },
  ];

  const chartData = filteredData.map((item) => ({
    x: new Date(item.date).getTime(),
    y: item.rank_win,
    label: format(parseISO(item.date), 'MMM. d, yyyy'),
  }));

  const chartOptions = {
    chart: {
      id: 'chart-id',
    },
    xaxis: {
      type: 'datetime',
    },
  };

  // Function to filter data based on filter type and input
  const filterData = (originalData, type, input) => {
    const currentDate = new Date();
    const filtered = originalData.filter((item) => {
      const itemDate = new Date(item.date);
      switch (type) {
        case 'day':
          return (
            currentDate.getDate() === itemDate.getDate() &&
            item.rank_win.toString().includes(input)
          );
        case 'week':
          return (
            currentDate.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000 &&
            item.rank_win.toString().includes(input)
          );
        case 'month':
          return (
            currentDate.getMonth() === itemDate.getMonth() &&
            currentDate.getFullYear() === itemDate.getFullYear() &&
            item.rank_win.toString().includes(input)
          );
        default:
          return true;
      }
    });
    setFilteredData(filtered);
  };

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
    filterData(data, newFilterType, filterInput);
  };

  const exportToExcel = async () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    wsData.push(['Date', 'Rank (Win)']);
    filteredData.forEach((item) => {
      wsData.push([format(parseISO(item.date), 'MMM. d, yyyy'), item.rank_win]);
    });
  
    // Capture the chartRef as an image
    const canvas = await html2canvas(chartRef.current);
    const chartImage = canvas.toDataURL('image/png');
  
    // Insert the image placeholder into wsData
    wsData.push(['Chart Image', '', '']);
  
    const ws = XLSX.utils.aoa_to_sheet(wsData);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
    // Convert the chart image to a worksheet
    const chartWs = XLSX.utils.table_to_sheet(chartRef.current);
  
    // Add the chart worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, chartWs, 'Chart');
  
    // Update the image placeholder with the actual image
    ws['C3'] = { t: 's', v: chartImage, s: { dataType: 's', hyperlink: chartImage } };
  
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `QueryData_${queryNameFromUrl}.xlsx`);
  };
  

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">Ranks for Query: {queryNameFromUrl}</h2>
      <div className="bg-white mt-10 rounded-lg mx-auto flex  flex-col shadow-md min-h-screen max-w-screen-xl ">
        <div className=" mt-[50px] flex items-center justify-center mb-4">
          <div className="flex items-center ">
            <label className="mr-5 font-semibold text-lg">Filter Data:</label>
            <button
              className={`mr-2  px-3 py-2  rounded-md ${
                filterType === 'day' ? 'bg-blue text-white ' : 'bg-gray-200 text-black'
              }`}
              onClick={() => handleFilterChange('day')}
            >
              Day
            </button>
            <button
              className={`mr-2  px-3 py-2  rounded-md ${
                filterType === 'week' ? 'bg-blue text-white ' : 'bg-gray-200 text-black'
              }`}
              onClick={() => handleFilterChange('week')}
            >
              Week
            </button>
            <button
              className={` px-3 py-2 rounded-md ${
                filterType === 'month' ? 'bg-blue text-white  ' : 'bg-gray-200 text-black'
              }`}
              onClick={() => handleFilterChange('month')}
            >
              Month
            </button>
            
          </div>
          
        
          {/* Add Export to Excel button */}
          <button
            className="px-3 py-2 rounded-md bg-green-500 text-white ml-4"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        
        </div>
        {loading ? (
          <div className="mt-[200px] flex items-center text-center mx-auto flex-col ">
            <ClipLoader color={'#123abc'} loading={loading} size={100} />
            <p>Loading...</p>
          </div>
        ) : (
          <div className='flex lg:flex-row  flex-col   justify-between px-[100px] py-[60px] '>
            <div>
              <DataTable columns={columns} data={filteredData} pagination />
            </div>
            <div className='mt-0 lg:mt-5' ref={chartRef}>
              <Chart options={chartOptions} series={[{ data: chartData }]} type="line" height={350} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryDetails;


