import React, { useState } from 'react';
import { Range } from 'react-range';

const RankRangeSlider = ({ minInitialValue, maxInitialValue, onRangeChange }) => {
  const [values, setValues] = useState([minInitialValue, maxInitialValue]);

  const handleChange = (values) => {
    setValues(values);
    onRangeChange({ min: values[0], max: values[1] });
  };

  return (
    <div className="space-y-4 mt-[30px]">

      <Range
        step={1}
        min={1}
        max={100}
        values={values}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div {...props} className="bg-blue rounded my2-4 h-[5px]" style={{...props.style}}>
            {children}
          </div>
        )}
    renderThumb={({ index, props, isDragged }) => (
        <div
          {...props}
          className={`${
            isDragged ? 'bg-green-900' : 'bg-slate-900'
          } h-4 w-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue`}
          style={{
            ...props.style,
            height: '16px',
            width: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            className="absolute mt-[0.5rem] text-xs font-medium text-white"
            style={{
              fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
              fontSize: '12px',
              top: '-28px',
              color: '#fff',
              fontWeight: 'bold',
              padding: '4px',
              borderRadius: '4px',
              backgroundColor: '#0d2218'
            }}
          >
            {values[index].toFixed(0)}
          </div>
          <div
            className="w-full h-full bg-blue-600 rounded-full"
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: isDragged ? '#d2b295' : '#ccc'
            }}
          />
        </div>
      )}
    />
    </div>
  );
};

export default RankRangeSlider;
