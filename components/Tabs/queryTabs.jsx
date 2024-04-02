
import React, { useEffect, useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import Chart from 'react-apexcharts';
import { parseISO, isSameDay, isSameWeek, isSameMonth, startOfWeek } from 'date-fns';
import Serpanalysis from "../Serpanalysis";
import { addDays } from 'date-fns';

const TabsCustomAnimation = ({ rowData }) => {
    
    const [activeTab, setActiveTab] = useState("tab1");
    const [tabData, setTabData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [yAxisMax, setYAxisMax] = useState(100);
    const [timePeriod, setTimePeriod] = useState('month');

    useEffect(() => {
        if (rowData) {
            const fetchTabData = async () => {
                const encodedQuery = encodeURIComponent(rowData.query);
                const encodedTargetUrl = encodeURIComponent(rowData.target_url);
                const url = `${process.env.REACT_APP_API_URL}/api/display-ranks/${rowData.user}/${encodedQuery}/${encodedTargetUrl}/${rowData.google_domain}/`;
                console.log(url)
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
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

    return (
        <Tabs value={activeTab} className="max-w-[100rem] mx-auto">
            <TabsHeader className="p-0 font-semibold bg-transparent border-b rounded-none border-blue-gray-50" 
            indicatorProps={{ className: "bg-transparent border-b-2 border-blue  shadow-none rounded-none" }}>
                <Tab key="tab1" value="tab1" onClick={() => setActiveTab("tab1")}>Rank Progress</Tab>
                <Tab key="tab2" value="tab2" onClick={() => setActiveTab("tab2")}>SERP Details</Tab>
                <Tab key="tab3" value="tab3" onClick={() => setActiveTab("tab3")}>Visibility</Tab>
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
                    <Chart options={chartOptions} series={[{ data: seriesData }]} type="line" height={200} />
                </TabPanel>
                <TabPanel key="tab2" value="tab2">
                    <Serpanalysis rowData={rowData}/>
                </TabPanel>
                {/* <TabPanel key="tab3" value="tab3">
                    <p>Visibility</p>
                </TabPanel> */}
            </TabsBody>
        </Tabs>
    );
};

export default TabsCustomAnimation;
