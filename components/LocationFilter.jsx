

import React from 'react';
import Select, { components } from 'react-select';
import EGYPT from '../assets/images/EGYPT.png';
import USA from '../assets/images/USA.png';
import AE from '../assets/images/DUBAI.png';
import GENERIC from '../assets/images/world.png';

const LocationFilter = ({ selectedLocationFilter, setSelectedLocationFilter }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      zIndex: 1000, // Ensure this is higher than other z-index values of sibling/parent elements
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000, // You might need to adjust this value
    }),
  
    option: (provided, state) => ({
      ...provided,
      flexDirection: "row",
      alignItems: "center",
    }),
  };

  const { Option } = components;
  const LocationOption = (props) => (
    <Option {...props} className="flex  justify-between items-center  ">
      <div className="flex items-center "> 
        <img 
          src={props.data.image} 
          alt={props.data.label} 
          className="w-5 h-5 mr-2 object-cover " 
        />
        <span className="text-base text-gray-800 ">{props.data.label}</span>
      </div>
    </Option>
  );
  
  

  const locationOptions = [
    { value: 'All Locations', label: 'All Locations', 
    image: GENERIC 
  },
    { value: 'US', label: 'USA', image: USA },
    { value: 'EG', label: 'Egypt', image: EGYPT },
    { value: 'AE', label: 'Dubai', image: AE },
  ];

  const handleChange = (selectedOption) => {
    setSelectedLocationFilter(selectedOption ? selectedOption.value : 'All Locations');
  };

  return (
    <Select
      options={locationOptions}
      getOptionLabel={(option) => (
        <div className="flex items-center">
          {option.image && <img src={option.image} alt={option.label} style={{ width: 20, marginRight: 10 }} />}
          {option.label}
        </div>
      )}
      value={locationOptions.find((option) => option.value === selectedLocationFilter)}
      onChange={handleChange}
      components={{ Option: LocationOption }}
      styles={customStyles}
    />
  );
};

export default LocationFilter;
