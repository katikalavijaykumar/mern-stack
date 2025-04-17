import { useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

const AdminLayout = ({ children }) => {
  // Ensure proper body class for dark mode in admin area
  useEffect(() => {
    // Adding an admin-layout class to allow for scoped styling if needed
    document.body.classList.add('admin-layout');
    
    return () => {
      document.body.classList.remove('admin-layout');
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-16 lg:ml-64">
        {/* Header */}
        <AdminHeader />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto mt-16 transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 