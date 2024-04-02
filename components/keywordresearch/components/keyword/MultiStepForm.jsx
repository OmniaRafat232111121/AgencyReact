import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step, Button } from '@material-tailwind/react';
import ReactSelect from 'react-select'; // Import ReactSelect component
import { Controller } from 'react-hook-form';
const MultiStepForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, control,setValue, formState: { errors } } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const keywordData = useSelector((state) => state.querySlice.data);
  console.log(keywordData)
  // const extractDomainName = (url) => {
  //   try {
  //     const hostname = new URL(url).hostname;
  //     const parts = hostname.split('.');
  //     const domainName = parts.length > 1 ? parts[parts.length - 2] : hostname;
  //     return domainName;
  //   } catch (e) {
  //     console.error('Invalid URL', e);
  //     return 'Invalid URL';
  //   }
  // };
  const extractDomainName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      // Split the hostname into parts
      const parts = hostname.split('.').reverse();
      let domainName = hostname;
  
      // Check if the URL ends with known TLDs that include a second-level domain (e.g., .co.uk, .com.eg)
      if (parts.length > 2) {
        // Known second-level TLDs (add more as needed)
        const secondLevelTLDs = ['co.uk', 'com.eg', 'net', 'org', 'co'];
        const potentialSecondLevelTLD = `${parts[1]}.${parts[0]}`;
  
        if (secondLevelTLDs.includes(potentialSecondLevelTLD)) {
          // Include the part before the second-level TLD if it's not a common subdomain
          if (parts[2] !== 'www') {
            domainName = parts[2];
          } else if (parts.length > 3) {
            // If there's a www, take the next part
            domainName = parts[3];
          }
        } else {
          // If not a known second-level TLD, take the second last part unless it's 'www'
          domainName = parts[1] !== 'www' ? parts[1] : parts[2];
        }
      } else {
        // For simpler TLDs, take the second last part
        domainName = parts[1] !== 'www' ? parts[1] : parts[0];
      }
  
      return domainName;
    } catch (e) {
      console.error('Invalid URL', e);
      return 'Invalid URL';
    }
  };
  
  const keywordOptions = keywordData.map((item) => ({
    name: extractDomainName(item.url),
    value: item.url,
  }));

  const onSubmit = (data) => {
    if (currentStep === 1) {
      const selectedItemStep1 = keywordData.find(item => item.url === data.firstDropdown);
      const selectedItemsStep2 = data.secondDropdown.map(url =>
        keywordData.find(item => item.url === url)
      );
      const domainNameStep1 = extractDomainName(selectedItemStep1.url);
      // Extract domain names for step 2 selections
      const domainNamesStep2 = selectedItemsStep2.map(item => item ? extractDomainName(item.url) : '');
  
      const comparisonData = {
        domainNameStep1,
        domainNamesStep2, // Include this in your comparisonData
        step1ResultSample: selectedItemStep1 ? selectedItemStep1.results_sample : [],
        step2ResultsSample: selectedItemsStep2.map(item => item ? item.results_sample : []),
      };
      navigate('/comparepage', { state: { comparisonData } });
      if (onClose) onClose();
    } else {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  const handlePrev = () => setCurrentStep(prevStep => prevStep - 1);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  ">
    
{currentStep === 0 && (
    <div>
        <label htmlFor="firstDropdown" className="block text-lg font-bold">
            Select Option :
        </label>
        <Controller
      name="secondDropdown"
      control={control}
      rules={{ required: 'This field is required' }}
      render={({ field }) => (
        <ReactSelect
    id="firstDropdown"
    options={keywordOptions.map(option => ({
        value: option.value,
        label: option.name
    }))}
    className="text-base mt-1 block w-full"
    theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
            ...theme.colors,
            primary25: '#BA9934', // Background color when you hover over the options
            primary: '#CFBE8A', // Border color
        },
    })}
    styles={{
        option: (provided, state) => ({
            ...provided,
            color: state.isFocused ? 'white' : provided.color,
            backgroundColor: state.isFocused ? '#BA9934' : provided.backgroundColor,
        }),
    }}
    onChange={(selectedOption) => {
        setValue('firstDropdown', selectedOption ? selectedOption.value : '');
        if (selectedOption) {
            // If an option is selected, move to the next step
            setCurrentStep(prevStep => prevStep + 1);
        }
    }}
/>
)}
/>
{errors.secondDropdown && <span className="text-md text-gray-400">{errors.secondDropdown.message}</span>}
        {/* {errors.firstDropdown && <span className="text-md text-red-500">This field is required</span>} */}
    </div>
)}
{currentStep === 1 && (
    <div>
        <label htmlFor="secondDropdown" className="block  text-lg font-bold">to be Compared to :</label>
        <Controller
      name="secondDropdown"
      control={control}
      rules={{ required: 'This field is required' }}
      render={({ field }) => (
        <ReactSelect
            id="secondDropdown"
            options={keywordOptions
                .filter(option => option.value !== watch('firstDropdown'))
                .map(option => ({
                    value: option.value,
                    label: option.name
                }))}
            isMulti
            className="text-base mt-1 block w-full"
            classNamePrefix="select"
            theme={(theme) => ({
                ...theme,
                borderRadius: 4,
                colors: {
                    ...theme.colors,
                    primary25: '#BA9934',
                    primary: '#CFBE8A',
                },
            })}
            styles={{
              option: (provided, state) => ({
                  ...provided,
                  color: state.isFocused ? 'white' : provided.color,
                  backgroundColor: state.isFocused ? '#BA9934' : provided.backgroundColor,
                  ':active': {
                      ...provided[':active'],
                      backgroundColor: state.isFocused ? '#CFBE8A' : provided.backgroundColor,
                  },
              }),
              multiValue: (provided, state) => ({
                  ...provided,
                  backgroundColor: '#BA9934',
              }),
              multiValueLabel: (provided, state) => ({
                  ...provided,
                  color: 'white',
              }),
              multiValueRemove: (provided, state) => ({
                  ...provided,
                  backgroundColor: '#BA9934',
                  color: 'white',
                  ':hover': {
                      backgroundColor: 'white',
                      color: '#BA9934',
                  },
              }),
          }}
            onChange={(selectedOptions) => {
                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                setValue('secondDropdown', values);
            }}
        />
        )}
        />
        {errors.secondDropdown && <span className="text-md text-gray-400">{errors.secondDropdown.message}</span>}
    </div>
)}
<div className="flex justify-between pt-8 items-center space-x-3 ">
  {currentStep > 0 && (
    <button
      onClick={handlePrev}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue
        px-6 py-2 text-sm font-medium text-white hover:bg-blue focus:outline-none
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Prev
    </button>
  )}
  <Button
    type="submit"
    className={`inline-flex justify-center rounded-md border border-transparent bg-blue
      px-6 py-2 text-sm font-medium text-white hover:bg-blue focus:outline-none
      focus:ring-2 focus:ring-blue focus:ring-offset-2 transition-colors duration-200
      ${currentStep === 0 ? 'ml-auto' : 'mx-2'}`}
  >
    {currentStep === 1 ? 'Compare' : 'Next'}
  </Button>
    <Button
      onClick={onClose}
      className="inline-flex justify-center rounded-md border border-transparent bg-red-600
        px-6 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none
        focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Close
    </Button>
</div>
    </form>
  );
};
export default MultiStepForm;