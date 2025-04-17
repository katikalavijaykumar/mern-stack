import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/api/usersApiSlice';
import { logout } from '../redux/features/auth/authSlice';
import { FaUser, FaSignOutAlt, FaCog, FaBell, FaSearch } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const AdminHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [logoutApiCall] = useLogoutMutation();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4 fixed w-full top-0 z-30 ml-0 md:ml-16 md:w-[calc(100%-4rem)]">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="w-1/3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        
        {/* Right side - User menu, notifications, theme toggle */}
        <div className="flex items-center space-x-6">
          {/* Theme Toggle */}
          <div className="text-gray-700 dark:text-gray-300">
            <ThemeToggle />
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <a href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <FaUser className="text-primary-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">New user registered</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <FaShoppingBag className="text-green-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">New order received</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                      </div>
                    </div>
                  </a>
                </div>
                <a href="#" className="block px-4 py-2 text-center text-sm text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-600 border-t border-gray-200 dark:border-gray-600">
                  View all notifications
                </a>
              </div>
            )}
          </div>
          
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <span className="hidden md:inline-block text-gray-700 dark:text-gray-300">
                {userInfo?.username || userInfo?.name || 'Admin'}
              </span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {userInfo?.username || userInfo?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userInfo?.email}
                  </p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <FaUser className="inline mr-2" />
                  Profile
                </Link>
                <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <FaCog className="inline mr-2" />
                  Settings
                </Link>
                <button 
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 