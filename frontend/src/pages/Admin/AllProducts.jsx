import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery, useDeleteProductMutation } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const sorted = [...filtered].sort((a, b) => {
        if (sortField === "price") {
          return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
        } else if (sortField === "countInStock") {
          return sortDirection === "asc" ? a.countInStock - b.countInStock : b.countInStock - a.countInStock;
        } else if (sortField === "name") {
          return sortDirection === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else {
          // Default sort by date
          return sortDirection === "asc" 
            ? new Date(a.createdAt) - new Date(b.createdAt) 
            : new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
      
      setSortedProducts(sorted);
    }
  }, [products, sortField, sortDirection, searchTerm]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortDirection === "asc" ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />;
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success(`${productName} deleted successfully`);
        refetch(); // Refresh the products list
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete product");
      }
    }
  };

  const toggleProductStatus = (productId) => {
    // This would be connected to a real API endpoint in a complete implementation
    toast.info("Product status toggle functionality will be implemented with API integration");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
        Error loading products. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/4 order-2 lg:order-1">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                Products Management ({sortedProducts.length})
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <Link
                  to="/admin/productlist"
                  className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
                >
                  Add New Product
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")}>
                      Product {getSortIcon("name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("price")}>
                      Price {getSortIcon("price")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("countInStock")}>
                      Stock {getSortIcon("countInStock")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("createdAt")}>
                      Date {getSortIcon("createdAt")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                              alt={product.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">${product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.countInStock > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {moment(product.createdAt).format("MMM D, YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/admin/product/update/${product._id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit product"
                          >
                            <FaEdit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete product"
                          >
                            <FaTrash size={18} />
                          </button>
                          <Link 
                            to={`/product/${product._id}`}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="View product"
                          >
                            <FaEye size={18} />
                          </Link>
                          <button 
                            onClick={() => toggleProductStatus(product._id)}
                            className={`${product.isActive ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            title={product.isActive ? "Set inactive" : "Set active"}
                          >
                            {product.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:w-1/4 order-1 lg:order-2 mb-6 lg:mb-0 lg:pl-6">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
