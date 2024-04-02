import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import uniqBy from 'lodash/uniqBy';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';

const BookmarkDetails = ({bookmarkId }) => {
    const chartRef = useRef(null); 
    const displayBookmarkSlice = useSelector((state) => state.displayBookmarkSlice.bookmarks);
  
  const [favosData, setFavosData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(state => state?.authSlice?.id);
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [yAxisMin, setYAxisMin] = useState(0);
  const [yAxisMax, setYAxisMax] = useState(100);

  useEffect(() => {
    const fetchFavosData = async () => {
      try {
        const favosResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/DisplayFavos/${userId}/${bookmarkId}/`);
        console.log("This is favourite",favosResponse)
        if (favosResponse.status === 200) {
          setFavosData(favosResponse.data);
        } else {
          console.error('Error fetching favos data:', favosResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching favos data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavosData();
  }, [userId, bookmarkId]);




  useEffect(() => {
    handleFilter(selectedPeriod);
  }, [favosData, selectedPeriod]);

  const handleFilter = (period) => {
    const currentDate = new Date();
    let startDate;

    if (period === 'day') {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 6);
    } else if (period === 'month') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 30);
    } else {
      startDate = new Date(currentDate);
    }
    const filtered = favosData.filter(item => {
      const itemDate = new Date(item.rank.date);
      return itemDate >= startDate && itemDate <= currentDate;
    });
    const averageRank = filtered.reduce((acc, item) => acc + item.rank.rank, 0) / filtered.length;
    setFilteredData([{ rank: { rank: averageRank, date: format(new Date(), 'yyyy-MM-dd') } }]);
  // Since we are only showing average, the min and max can be the same
  setYAxisMin(averageRank);
  setYAxisMax(averageRank);
    // Remove duplicates based on 'rank.query'
    // const uniqueFilteredData = uniqBy(filtered, 'rank.query');

    // setFilteredData(uniqueFilteredData);

    // const minRank = Math.min(...uniqueFilteredData.map(item => item.rank.rank));
    // const maxRank = Math.max(...uniqueFilteredData.map(item => item.rank.rank));

    // setYAxisMin(Math.max(0, minRank - 5)); // Adjust as needed
    // setYAxisMax(maxRank + 5); // Adjust as needed
  };
  const calculateAverageRank = (data) => {
    const total = data.reduce((sum, item) => sum + item.rank.rank, 0);
    return total / data.length;
  };
  
  useEffect(() => {
    if (favosData.length > 0) {
      const averageRank = calculateAverageRank(favosData);
      console.log(averageRank)
      setFilteredData([{ rank: { date: new Date().toISOString(), rank: averageRank } }]); // Set only one data point with the average rank
      setYAxisMin(averageRank - 5); // Adjust the Y-axis min value as needed
      setYAxisMax(averageRank + 5); // Adjust the Y-axis max value as needed
    }
  }, [favosData]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color={'#2563EB'} loading={loading} size={50} />
        <p className="ml-2 text-lg text-black">Loading...</p>
      </div>
    );
  }

  

  
  const chartData = [{
    x: new Date(filteredData[0].rank.date).getTime(),
    y: filteredData[0].rank.rank,
  }];
  const chartOptions = {
    chart: {
      id: 'chart-id',
      type: 'line',
      zoom: {
        enabled: false,
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
    },
    xaxis: {
      title: {
        text: 'Date',
      },
      reversed: true,
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Rank',
      },
      labels: {
        formatter: (value) => value.toFixed(0),
      },
      reversed: true,
      min: yAxisMin,
      max: yAxisMax,
    },
    colors: ['#FF7A00'],
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
        borderColor: '#FF7A00',
      },
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45,
      },
    },
  };
  const exportToExcel = async () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    wsData.push(['Date', 'Rank (Win)']);
    filteredData.forEach((item) => {
      wsData.push([format(parseISO(item.rank.date), 'MMM. d, yyyy'), item.rank.rank]);
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
    const chartWs = XLSX.utils.json_to_sheet([{ image: chartImage }]);
    XLSX.utils.book_append_sheet(wb, chartWs, 'Chart');
  
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `QueryData_${bookmarkId}.xlsx`);
  };
  return (
    <div className="relative flex flex-col  z-[100] bg-white max-w-screen-xl mx-auto p-3 mt-[1rem]
    border-2 border-gray-200 rounded-lg">
    

      <div className="text-black p-2 rounded-lg flex justify-between items-center space-x-2 lg:w-full w-[70%] mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <button
            className={`px-7 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
              selectedPeriod === 'day' ? 'bg-blue text-white shadow-sm' : 'bg-white text-blue hover:bg-blue hover:text-white hover:shadow'
            }`}
            onClick={() => {
              setSelectedPeriod('day');
              handleFilter('day');
            }}
          >
            Today
          </button>
          <button
            className={`px-7 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
              selectedPeriod === 'week' ? 'bg-blue text-white shadow-sm' : 'bg-white text-blue hover:bg-blue hover:text-white hover:shadow'
            }`}
            onClick={() => {
              setSelectedPeriod('week');
              handleFilter('week');
            }}
          >
            Week
          </button>
          <button
            className={`px-7 py-2 text-sm font-bold rounded-md transition-colors duration-300 ${
              selectedPeriod === 'month' ? 'bg-blue text-white shadow-sm' : 'bg-white text-blue hover:bg-blue hover:text-white hover:shadow'
            }`}
            onClick={() => {
              setSelectedPeriod('month');
              handleFilter('month');
            }}
          >
            Month
          </button>
        </div>

      <div>
      <button
         onClick={exportToExcel}

      className="px-2 py-1 ml-2 text-white transition-all duration-300 ease-in-out bg-green-500 border border-green-500 rounded-lg hover:bg-green-600 hover:text-white"
    >
      Export to Excel
    </button>
        </div>
      </div>
      

  


 

   

   

      <div className="" ref={chartRef}>
  <Chart options={chartOptions} series={[{ data: chartData }]} type="line" height={250} />
</div>


     
    </div>
  );
};

export default BookmarkDetails;

