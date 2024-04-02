
import React, { useEffect, useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import Chart from 'react-apexcharts';
import { parseISO, isSameDay, isSameWeek, isSameMonth, startOfWeek } from 'date-fns';
import Serpanalysis from "../Serpanalysis";
import { addDays } from 'date-fns';
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";

const TabsProjects = ({ rowData ,projectId  }) => {
    console.log(rowData)
    
    const [activeTab, setActiveTab] = useState("tab1");
    const [tabData, setTabData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [yAxisMax, setYAxisMax] = useState(100);
    const [timePeriod, setTimePeriod] = useState('month');
    const userId = useSelector((state) => state?.authSlice?.user?.id);
    const [visibilityData, setVisibilityData] = useState([]);
    useEffect(() => {
        if (rowData.first_five_links) {
            const preparedData = prepareVisibilityData(rowData.first_five_links);
            setVisibilityData(preparedData);
        }
    }, [rowData]);
    useEffect(() => {
        if (rowData) {
            const fetchTabData = async () => {
                const encodedQuery = encodeURIComponent(rowData.query);
                const queryId = encodeURIComponent(rowData.query_id);

                const encodedTargetUrl = encodeURIComponent(rowData.target_url);
                const url = `${process.env.REACT_APP_API_URL}/api/display-project-ranks/${userId}/${queryId}/${projectId}/`;
                console.log(url)
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data)
                        setTabData(data);
                        processChartData(data, 'day');
                    } else {
                        console.error('Error fetching data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchTabData();
        }
    }, [rowData]);

    const handleTimePeriodChange = (e) => {
        setTimePeriod(e.target.value);
        processChartData(tabData, e.target.value);
    };

    const processChartData = (data, selectedTimePeriod) => {
        let filteredData = filterDataByTimePeriod(data, selectedTimePeriod);
        
        const chartSeries = filteredData.map(item => {
            const date = new Date(item.date);
            return {
                x: date.getTime(), // Use timestamp for x-axis
                y: parseInt(item.rank, 10)
            };
        });

        const ranks = chartSeries.map(item => item.y);
        const minRank = Math.min(...ranks);
        const maxRank = Math.max(...ranks);
        const buffer = 1;

        setSeriesData(chartSeries);
        setYAxisMin(Math.max(0, minRank - buffer));
        setYAxisMax(maxRank + buffer);
    };

    const filterDataByTimePeriod = (data, timePeriod) => {
        const currentDate = new Date();
        return data.filter(item => {
            const itemDate = parseISO(item.date);
            switch(timePeriod) {
                case 'day':
                    return isSameDay(currentDate, itemDate);
                case 'week':
                    return itemDate >= addDays(currentDate, -7); // Last 7 days
                case 'month':
                    return itemDate >= addDays(currentDate, -30); // Last 30 days
                default:
                    return true;
            }
        });
    };
    

    useEffect(() => {
        if (tabData.length > 0) {
            processChartData(tabData, timePeriod);
        }
    }, [timePeriod, tabData]);
    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px', // Left padding for header cells
                paddingRight: '8px', // Right padding for header cells
                fontWeight: 'bold', // Font weight for header cells
                color: '#007bff', // Font color for header cells
                fontSize: '15px', // Font size for header cells
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // Left padding for cells
                paddingRight: '8px', // Right padding for cells
                fontSize: '14px', // Font size for cells
            },
        },
    };
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
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },
            background: '#0000',
            style:{
                width:'100%',
            },
            
        
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

            // background: {
            //     enabled: true,
            //     foreColor: '#fff',
            //     padding: 4,
            //     borderRadius: 2,
            //     borderWidth: 1,
            //     borderColor: '#ba9934',
            //     opacity: 0.9,
            //     dropShadow: {
            //       enabled: false,
            //       top: 1,
            //       left: 1,
            //       blur: 1,
            //       color: '#000',
            //       opacity: 0.45
            //     }
            //   },
        }
    };
    const extractDomainName = (url) => {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch (error) {
            console.error('Invalid URL:', url);
            return '';
        }
    };

    // Function to prepare visibility data from first_five_links
    const prepareVisibilityData = (firstFiveLinks) => {
        let linksArray = [];
        try {
            linksArray = JSON.parse(firstFiveLinks.replace(/'/g, '"'));
        } catch (error) {
            console.error("Error parsing first_five_links", error);
        }

        return linksArray.map((link, index) => ({
            id: index + 1,
            url: link,
            domain: extractDomainName(link),
        }));
    };
    
     
    return (
        <Tabs value={activeTab} className="max-w-[100rem] mx-auto">
            <TabsHeader className="p-0 font-semibold bg-transparent border-b rounded-none border-blue-gray-50" 
            indicatorProps={{ className: "bg-transparent border-b-2 border-blue  shadow-none rounded-none" }}>
                <Tab key="tab1" value="tab1" onClick={() => setActiveTab("tab1")}>Rank Progress</Tab>
                <Tab key="tab2" value="tab2" onClick={() => setActiveTab("tab2")}>SERP Details</Tab>
            </TabsHeader>
            <TabsBody>
                <TabPanel key="tab1" value="tab1">
                    <div className="flex justify-between">
                        <h1 className="text-left mr-[50px] mb-[-20px] font-semibold text-xl">Latest rank : <span className="font-bold text-blue">{rowData?.rank}</span></h1>
                        <h1 className="text-right mr-[50px] mb-[-20px] text-blue font-bold">{rowData?.query}</h1>
                        <div className="mb-4">
                            <select onChange={handleTimePeriodChange} value={timePeriod} className="px-6 border rounded ">
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex border rounded-md">
                    <Chart
                     options={chartOptions} series={[{ data: seriesData }]} type="line" height={300}
                    className='w-[50%] p-[10px]' />
                    
                    <div className="relative overflow-x-auto sm:rounded-lg w-[50%]  p-[25px] rounded">

                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Numbers</th>
                                <th scope="col" className="px-6 py-3">Domain Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibilityData.map((link, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{link.id}</td>
                                    <td className="px-6 py-4">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {link.domain}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                
                    </div>
                </TabPanel>
                <TabPanel key="tab2" value="tab2">
                    <Serpanalysis rowData={rowData}/>
                </TabPanel>
            
                
            </TabsBody>
        </Tabs>
    );
};

export default TabsProjects;
