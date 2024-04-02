import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMostCommonTargetUrl } from '../redux/lib/quoriesSlice';
import ReactApexChart from 'react-apexcharts';
// If using date formatting
import { format } from 'date-fns';
const TargetBox = () => {
    const userId = useSelector(state => state?.authSlice?.id);
  const mostCommonUrl = useSelector(selectMostCommonTargetUrl);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [], // Initialize with empty categories, will be updated
      },
      yaxis: {
        title: {
          text: 'Visits'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " visits"
          }
        }
      }
    }
  });

  useEffect(() => {
    const fetchDataForChart = async () => {
      if (!mostCommonUrl) return;

      const encodedTargetUrl = encodeURIComponent(mostCommonUrl);
      const url = `${process.env.REACT_APP_API_URL}/api/getit_by_url/${userId}/${encodedTargetUrl}/`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const apiData = await response.json();
        processChartData(apiData); // Function to process and update chart data
      } catch (error) {
        console.error('Fetching chart data failed:', error);
      }
    };

    fetchDataForChart();
  }, [mostCommonUrl]);
  const processChartData = (apiData) => {
    const categories = apiData.map(item => format(new Date(item.date_truncated), 'MMM d'));
    const seriesData = apiData.map(item => item.average_rank);
  
    setChartData(prevState => ({
      ...prevState,
      series: [{ name: "Average Rank", data: seriesData }],
      options: {
        ...prevState.options,
        xaxis: { ...prevState.options.xaxis, categories: categories }
      }
    }));
  };

  
  // useEffect(() => {
  //   const fetchDataForChart = async () => {
  //     const url = `${process.env.REACT_APP_API_URL}/api/getit_by_url/${userId}/${encodedTargetUrl}/`;
  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const apiData = await response.json();
  //       processChartData(apiData); // Function to process and set chart data
  //     } catch (error) {
  //       console.error('Fetching chart data failed:', error);
  //     }
  //   };
  
  //   fetchDataForChart();
  // }, []); 
  return (
    <div className=' w-[50%] cursor-pointer   rounded-sm space-y-4 ' >

      {mostCommonUrl ? (
        <>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
             Most common target URL: {mostCommonUrl}
          </h2>
          {/* <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="bar" 
          height={350}
        /> */}
        </>
      ) : (
        <p>No target URLs found.</p>
      )}
    </div>
  );
};

export default TargetBox;
