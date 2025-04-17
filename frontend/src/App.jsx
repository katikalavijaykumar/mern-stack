import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const App = () => {
  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Apply saved theme preference
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // If no saved preference, check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);
  
  return (
    <>
      <ToastContainer theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'} />
      <Navigation />
      <main className="py-3 min-h-screen dark:bg-dark-primary dark:text-dark-primary transition-colors duration-200">
        <Outlet />
      </main>
    </>
  );
};

export default App;
