import { useState, useEffect } from 'react';
import { FaUsers, FaShoppingBag, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetProductsQuery } from '../../redux/api/productApiSlice';

// Mock data for dashboard statistics - replace with actual API calls
const mockStats = {
  totalSales: 15482.65,
  totalOrders: 238,
  totalProducts: 45,
  totalUsers: 152,
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', date: '2023-06-10', amount: 125.99, status: 'completed' },
    { id: 'ORD-002', customer: 'Jane Smith', date: '2023-06-09', amount: 85.50, status: 'processing' },
    { id: 'ORD-003', customer: 'Robert Johnson', date: '2023-06-08', amount: 220.75, status: 'completed' },
    { id: 'ORD-004', customer: 'Emily Davis', date: '2023-06-07', amount: 65.25, status: 'cancelled' },
    { id: 'ORD-005', customer: 'Michael Wilson', date: '2023-06-06', amount: 175.00, status: 'completed' },
  ],
  salesData: [
    { month: 'Jan', sales: 1200 },
    { month: 'Feb', sales: 1900 },
    { month: 'Mar', sales: 1500 },
    { month: 'Apr', sales: 1700 },
    { month: 'May', sales: 2200 },
    { month: 'Jun', sales: 2500 },
  ]
};

const StatCard = ({ title, value, icon, bgColor }) => (
  <div className={`${bgColor} rounded-lg shadow-md p-6 flex items-center`}>
    <div className="w-12 h-12 rounded-full bg-white bg-opacity-25 flex items-center justify-center mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-white text-lg font-medium">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  // Get real product data
  const { data: productsData, isLoading, error } = useGetProductsQuery({});
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Update stats with real product count when data loads
    if (productsData) {
      setStats(prev => ({ 
        ...prev, 
        totalProducts: productsData.products?.length || prev.totalProducts
      }));
    }
  }, [productsData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-blue-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message || 'Error loading dashboard data'}
          </Message>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Sales" 
                value={formatCurrency(stats.totalSales)} 
                icon={<FaMoneyBillWave className="text-white text-2xl" />} 
                bgColor="bg-gradient-to-r from-blue-500 to-blue-600" 
              />
              <StatCard 
                title="Total Orders" 
                value={stats.totalOrders} 
                icon={<FaShoppingBag className="text-white text-2xl" />} 
                bgColor="bg-gradient-to-r from-purple-500 to-purple-600" 
              />
              <StatCard 
                title="Total Products" 
                value={stats.totalProducts} 
                icon={<FaChartLine className="text-white text-2xl" />} 
                bgColor="bg-gradient-to-r from-green-500 to-green-600" 
              />
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={<FaUsers className="text-white text-2xl" />} 
                bgColor="bg-gradient-to-r from-pink-500 to-pink-600" 
              />
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Orders</h2>
                  <Link to="/admin/orderlist" className="text-primary-500 hover:text-primary-600 text-sm">
                    View All
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Order ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Customer</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Amount</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{order.customer}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{order.date}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {formatCurrency(order.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Top Selling Products */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Selling Products</h2>
                
                <div className="space-y-4">
                  {productsData && productsData.products ? (
                    productsData.products.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
                          <img 
                            src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.png';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            ${product.price}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.countInStock} in stock
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No products found</p>
                  )}
                </div>
                
                <Link to="/admin/allproductslist" className="mt-4 block text-center text-primary-500 hover:text-primary-600 text-sm">
                  View All Products
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 