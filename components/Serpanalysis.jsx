import React, { useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Serpanalysis = ({ rowData }) => {
    const maxRank = 100;
    const rankPercentage = rowData ? (rowData.rank_abs / maxRank) * 100 : 0;
    const rankGroupPercentage = rowData ? (rowData.rank / maxRank) * 100 : 0;
    const userId = useSelector((state) => state?.authSlice?.user?.id);

    const pathColor = '#FF7A00';
    const textColor = '#000000';
    const trailColor = '#d6d6d6';
    const [hoverRankGroup, setHoverRankGroup] = useState(false);
    const [hoverRankAbsolute, setHoverRankAbsolute] = useState(false);

    const CustomText = ({ isHovered, text, hoveredText }) => (
        <div className='text-sm'>
            {isHovered ?
                <span className='text-black bg-white shadow-md p-1 rounded-md absolute right-[50px] 
                top-2 font-semibold text-center mx-auto flex items-center justify-center'>{hoveredText}</span> :
                <span className='text-black font-semibold text-center mx-auto'>{text}</span>
            }
        </div>
    );

    return (
        <div className="w-full mx-auto">
            {rowData && (
                <div className="mb-6 p-4 border-b shadow-lg border-gray-300 rounded-lg flex justify-between">
                    {/* Left side content */}
                    <div>
                        <p className="font-bold text-lg mb-2">Keyword:
                            <span className='text-blue font-semibold'> {rowData.query}</span>
                        </p>
                        <p className="font-bold text-lg mb-2">Type:
                            <span className='text-blue font-semibold'> {rowData.Type_rank}</span>
                        </p>
                        <p className="text-gray-600 mb-2 font-bold">Result State:
                            <span className='font-semibold'> {rowData.result_stat}</span>
                        </p>
                        <p className="text-gray-600 mb-2 font-bold">Breadcrumb:
                            <span className='font-semibold'> {rowData.breadcrumb}</span>
                        </p>
                        <p className="text-gray-600 mb-2 font-bold">TargetUrl:
                        {" "}
                            <span className='font-bold text-blue'>
                            <Link to={`/targets/${userId}/${encodeURIComponent(rowData.target_url)}/`}>

                                    {rowData.target_url}
                                </Link>
                            </span>
                        </p>
                        
                    <div className='p-3 flex items-center justify-center space-x-[50px] '>
                        {/* Rank Group Progress Bar */}
                        <div className="flex items-center" onMouseEnter={() => setHoverRankGroup(true)} onMouseLeave={() => setHoverRankGroup(false)}>
                            <div className="w-20 h-24">
                                <CircularProgressbarWithChildren value={rankGroupPercentage} styles={buildStyles({ pathColor, trailColor })}>
                                    <CustomText isHovered={hoverRankGroup} text={rowData.rank} hoveredText="Rank Group" />
                                </CircularProgressbarWithChildren>
                            </div>
                        </div>

                        {/* Rank Absolute Progress Bar */}
                        <div className="flex items-center" onMouseEnter={() => setHoverRankAbsolute(true)} onMouseLeave={() => setHoverRankAbsolute(false)}>
                            <div className="w-20 h-24">
                                <CircularProgressbarWithChildren value={rankPercentage} styles={buildStyles({ pathColor, trailColor })}>
                                    <CustomText isHovered={hoverRankAbsolute} text={rowData.rank_abs} hoveredText="Rank Absolute" />
                                </CircularProgressbarWithChildren>
                            </div>
                        </div>
                    </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Serpanalysis;
