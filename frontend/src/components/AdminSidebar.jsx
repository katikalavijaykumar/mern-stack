import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaShoppingBag, 
  FaUsers, 
  FaTags, 
  FaClipboardList, 
  FaBars, 
  FaTimes,
  FaChartLine
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <FaTachometerAlt />
    },
    {
      path: '/admin/productlist',
      name: 'Create Product',
      icon: <FaShoppingBag />
    },
    {
      path: '/admin/allproductslist',
      name: 'All Products',
      icon: <FaClipboardList />
    },
    {
      path: '/admin/categorylist',
      name: 'Categories',
      icon: <FaTags />
    },
    {
      path: '/admin/userlist',
      name: 'Users',
      icon: <FaUsers />
    },
    {
      path: '/admin/orderlist',
      name: 'Orders',
      icon: <FaChartLine />
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className={`md:hidden fixed ${isOpen ? 'left-64' : 'left-4'} top-4 z-50 p-2 rounded-md bg-primary-500 text-white transition-all duration-300`}
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 z-40
          ${isOpen ? 'w-64' : 'w-0 -left-64 md:left-0 md:w-16'}`}
      >
        <div className="flex justify-center p-4 border-b border-gray-700">
          <h1 className={`text-xl font-bold ${!isOpen && 'md:hidden'}`}>Admin Panel</h1>
          {!isOpen && <span className="hidden md:block text-xl"><FaBars /></span>}
        </div>

        <nav className="mt-5">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-3 mx-3 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={`ml-3 ${!isOpen && 'md:hidden'}`}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar; 