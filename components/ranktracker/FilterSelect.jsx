// FilterByTargetURL.jsx
import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const FilterByTargetURL = ({ uniqueTargetUrls, selectedTargetUrl, onFilterChange }) => {
    const animatedComponents = makeAnimated();

    return (
        <div className="p-4 w-full md:w-[28.33%] px-2">
            <label htmlFor="target-url-filter" className="block text-lg mt-3 mb-1">Filter by Target URL</label>
            <Select
                inputId="target-url-filter"
                closeMenuOnSelect={true}
                components={animatedComponents}
                options={uniqueTargetUrls.map((url) => ({ value: url, label: url }))}
                value={selectedTargetUrl}
                onChange={onFilterChange}
                className="w-full"
            />
        </div>
    );
};

export default FilterByTargetURL;
