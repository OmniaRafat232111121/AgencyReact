import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkApiHealth, checkNetworkStatus, clearError } from '../../redux/lib/errorSlice';

const ErrorMessage = () => {
    const dispatch = useDispatch();

// Assuming the error slice is directly under state and not nested
const errorMessage = useSelector((state) => state.errorSlice.message);

// useEffect(() => {
//     dispatch(checkApiHealth());
//   }, [dispatch]);


useEffect(() => {
    // Log when the useEffect hook runs
    console.log('Starting to monitor API health.');

    // Dispatch checkNetworkStatus immediately

    // Set an interval to periodically check API health
    const apiHealthInterval = setInterval(() => {
        console.log('Checking API health...');
        dispatch(checkApiHealth());
    }, 15000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
        console.log('Cleaning up: Stopping API health checks.');
        clearInterval(apiHealthInterval);
    };
}, [dispatch]); // Ensure this dependency list is correct based on your specific dependencies


if (!errorMessage) return null;

  return (
    <div 
    style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '10px',
        position: 'fixed', // Keep the message at the bottom of the viewport
        bottom: 0, // Position at the bottom
        width: '100%', // Ensure it spans the width of the screen
        textAlign: 'center', // Center the text
    }} 
    onClick={() => dispatch(clearError())}>
      {errorMessage} (click to dismiss)
    </div>
  );
};

export default ErrorMessage;
