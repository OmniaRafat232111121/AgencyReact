// DarkModeToggle.jsx
import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = storedDarkMode ? JSON.parse(storedDarkMode) : false;
  
    setIsDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);
  
  const handleToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <button className="flex items-center space-x-2" onClick={handleToggle}>
      {isDarkMode ? (
        <FiMoon  size={20} className="text-yellow-500 dark:text-gray-300 " />
      ) : (
        <FiSun size={20} className="text-yellow-500" />
      )}
    </button>
  );
};

export default DarkModeToggle;
