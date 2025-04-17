import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage if available, default to dark mode
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    // Update the document class and localStorage when theme changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-[26px] h-[26px] rounded-full overflow-hidden transition-all duration-500 focus:outline-none focus:ring-1 focus:ring-pink-500 hover:scale-110 flex items-center justify-center"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaMoon className="text-yellow-200 text-xl transition-all duration-300 transform" />
      ) : (
        <FaSun className="text-yellow-500 text-xl transition-all duration-300 transform" />
      )}
    </button>
  );
};

export default ThemeToggle; 