
import React, { useEffect, useState ,useRef} from 'react';
import { Link, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Chart from 'react-apexcharts';
import { format, parseISO, isSameDay, isSameWeek, isSameMonth, startOfWeek } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { deleteRank } from '../redux/lib/deleteRow';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { MdDeleteOutline } from "react-icons/md";
import USAFlagImage from '../assets/images/USA.png';
import EgyptFlagImage from '../assets/images/EGYPT.png';
import AEFlagImage from '../assets/images/DUBAI.png';
import { addDays } from 'date-fns';
const TargetDetails = ({ query }) => {
  console.log(query)

  const [selectedData, setSelectedData] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true); // New state for tracking iframe loading
  const [yAxisMin, setYAxisMin] = useState(0);
const [yAxisMax, setYAxisMax] = useState(100);
  const handleRowClicked = (rowData) => {
    setSelectedData(rowData);
  };
  const chartRef = useRef(null);
  const { userId, encodedQuery, encodedTargetUrl, google_domain } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('day');
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch(); 

  const filterButtons = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];
  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
  };
  
  


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/display-ranks/${userId}/${encodedQuery}/${encodedTargetUrl}/${google_domain}/`);
        if (response.ok) {
          const apiData = await response.json();
          setData(apiData);
          const filtered = filterData(apiData, filterType); 
          setFilteredData(filtered);

          const ranks = apiData.map(item => parseInt(item.rank));
          const minRank = Math.min(...ranks);
          const maxRank = Math.max(...ranks);
          setYAxisMin(minRank);
          setYAxisMax(maxRank);
         
          // Find the data entry for the current day
          const today = new Date();
          const todayData = filtered.find(item => isSameDay(parseISO(item.date), today));
          if (todayData) {
            setSelectedData(todayData); 
          }
  
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  // }, [userId, encodedQuery, encodedTargetUrl, filterType, google_domain]);
  
}, [userId, encodedQuery, encodedTargetUrl, filterType, google_domain]);


  
  const filterData = (originalData, type) => {
    const currentDate = new Date();
    return originalData.filter((item) => {
      const itemDate = parseISO(item.date);
      switch (type) {
        case 'day':
          return isSameDay(currentDate, itemDate);
        case 'week':
          return itemDate >= addDays(currentDate, -6); // Last 7 days
        case 'month':
          return itemDate >= addDays(currentDate, -30); // Last 30 days
        default:
          return true;
      }
    });
  };
  useEffect(() => {
    setFilteredData(filterData(data, filterType));
  }, [filterType, data]);

  const handleDeleteRow = (queryId) => {
    dispatch(deleteRank(queryId))
      .then(() => {
        // Remove the deleted row from the data state
        setData((prevData) => prevData.filter((item) => item.query_id !== queryId));
  
        // Update the filteredData state based on the current filterType
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item.query_id !== queryId)
        );
      })
      .catch((error) => {
        console.error('Error deleting row:', error);
      });
  };
  
  
  const columns = [
    {
      name: 'Date',
      selector: (row) => format(parseISO(row.date), 'EEE, MMM d, yyyy'),
  
      cell: (row) => (
        <span>
          {format(parseISO(row.date), 'EEE, MMM d, yyyy')}
        </span>
      ),
    },
    {
      name: 'Rank ',
      selector: (row) => row.rank,
     
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
       
          <button
            onClick={() => handleDeleteRow(row.query_id)} // Pass the query_id to the delete function
            className="px-2 py-1 ml-2 text-red-500 transition-all duration-300 ease-in-out border border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
          >
                   <MdDeleteOutline />

          </button>
        </div>
      ),
    },
 

    
  ];

 
 const chartOptions = {
        chart: {
            id: 'chart-id',
            type: 'line',
            zoom: {
                enabled: false
            },
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            }
        },
        xaxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            },
            reversed: true
        },
       
        yaxis: {
          title: {
            text: 'Rank'
          },
          labels: {
            formatter: (value) => value.toFixed(0)
          },
          reversed: true,
          min: yAxisMin,
          max: yAxisMax
        },
        colors: ['#ba9934'],
        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: -5,
          style: {
              fontSize: '14px',
              colors: ['#fff'],
              fontFamily: 'Helvetica, Arial, sans-serif',

              
          },
          background: {
              enabled: true,
              foreColor: '#000',
              borderRadius: 2,
              padding: 3,
              borderColor: '#ba9934',
              // backgroundColor:'green',
              borderRadius: 2
          },
          dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: '#000',
              opacity: 0.45
          }

         
      }
    };

  const chartSeries = [{
    name: 'Rank',
    data: filteredData.map(item => ({
      x: new Date(item.date).getTime(), // Convert date to timestamp
      y: parseInt(item.rank) // Ensure rank is an integer
    }))
  }];
  

  const exportToExcel = async () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    wsData.push(['Date', 'Rank (Win)']);
    filteredData.forEach((item) => {
      wsData.push([format(parseISO(item.date), 'MMM. d, yyyy'), item.rank]);
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
    XLSX.writeFile(wb, `QueryData_${encodedQuery}.xlsx`);
  };
  




  return (
   <div className="  relative flex flex-col  min-h-screen   z-[100] bg-white 
     mx-auto  p-4 mt-[4rem]">

        <div className="mt-8 text-center  mb-[60px]">
          <h1 className="text-3xl font-bold">{encodedQuery}</h1>
        </div>
        
        <div className="text-black  p-2 rounded-lg flex justify-between 
        items-center space-x-2 lg:w-full w-[70%] mx-auto">
  <div className="flex items-center justify-center space-x-2">
    {filterButtons.map((button) => (
      <button
        key={button.value}
        onClick={() => handleFilterChange(button.value)}
        className={`px-7 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
          filterType === button.value
            ? 'bg-blue text-white shadow-sm'
            : 'bg-white text-blue hover:bg-blue hover:text-white hover:shadow'
        }`}
      >
    {button.label}
      </button>
    ))}
  </div>

  <div className='flex space-x-3'>
  <button
      onClick={exportToExcel}
      className="px-2 py-1 ml-2 text-white transition-all duration-300 ease-in-out bg-green-500 border border-green-500 rounded-lg hover:bg-green-600 hover:text-white"
    >
      Export to Excel
    </button>


    <Link >
  <button 
      

    className="py-2 text-sm text-white transition-colors duration-300 rounded-md shadow-sm px-7 bg-blue hover:bg-white hover:text-blue"
  >
    {encodedTargetUrl}
  </button>
</Link>

  <div >
  {google_domain === 'US' && (
    <img className='w-8' src={USAFlagImage} alt="USA" />
  )}
  {google_domain === 'EG' && (
    <img className='w-8' src={EgyptFlagImage} alt="Egypt" />
  )}
  {google_domain === 'AE' && (
    <img className='w-8' src={AEFlagImage} alt="Dubai" />
  )}
    </div>

   <div>
   </div>
   
  </div>
</div>




   
    {loading ? (
      <div className="flex items-center justify-center h-64 mx-auto  lg:flex-col">
        <ClipLoader color={'#2563EB'} loading={loading} size={50} />
        <p className="ml-2 text-lg text-black">Loading...</p>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-between lg:flex-row bg-white shadow-sm
       rounded-md   lg:space-x-4
      lg:space-y-0 space-y-10 p-[20px] ">
        <div className="mt-0  lg:mb-5 lg:w-1/2">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            striped
            onRowClicked={handleRowClicked}
            highlightOnHover
            customStyles={{
              rows: {
                style: {
                  minHeight: '72px', // override the row height
                },
              },
              headCells: {
                style: {
                  backgroundColor: '#ba9934',
                  color: '#FFF', // white text
                },
              },
           
            }}
          />
        </div>
        <div className="lg:mb-0 lg:w-1/2 mt-0 md:mt-5  mb-[-10]" ref={chartRef}>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={250}
            className="px-3 py-4 bg-white shadow-sm"


          
          />
        </div>
     
      </div>
    )}



    </div>
  
  );
};

export default TargetDetails;
