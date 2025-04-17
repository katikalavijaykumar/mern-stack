import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { 
  useFetchCategoriesQuery, 
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../../redux/api/categoryApiSlice';

const CategoryList = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // RTK Query hooks
  const { data: categories, isLoading, refetch, error } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  
  // Reset form when editing state changes
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory({ 
          categoryId: editingCategory._id, 
          name 
        }).unwrap();
        toast.success('Category updated successfully');
      } else {
        // Create new category
        await createCategory({ name }).unwrap();
        toast.success('Category created successfully');
      }
      
      // Reset form and refresh categories
      setName('');
      setEditingCategory(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save category');
    }
  };
  
  // Handle edit button click
  const handleEdit = (category) => {
    setEditingCategory(category);
    // Scroll to form
    document.getElementById('category-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle delete
  const handleDelete = async (categoryId) => {
    if (confirmDelete === categoryId) {
      try {
        await deleteCategory(categoryId).unwrap();
        toast.success('Category deleted successfully');
        setConfirmDelete(null);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete category');
      }
    } else {
      setConfirmDelete(categoryId);
      // Auto-reset confirm state after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingCategory(null);
    setName('');
  };
  
  // Filter categories based on search term
  const filteredCategories = categories?.filter(
    category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {editingCategory ? 'Edit Category' : 'Create Category'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" id="category-form">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
                    transition-colors duration-200 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                
                {editingCategory && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 
                      text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Categories List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Categories</h2>
              
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">
                {error?.data?.message || error.error || 'Failed to load categories'}
              </Message>
            ) : filteredCategories?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No categories found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCategories?.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                          {category.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEdit(category)}
                              className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                              aria-label={`Edit ${category.name}`}
                            >
                              <FaEdit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(category._id)}
                              className={`${confirmDelete === category._id 
                                ? 'text-red-600 hover:text-red-700' 
                                : 'text-gray-500 hover:text-red-500'} transition-colors duration-200`}
                              aria-label={`Delete ${category.name}`}
                            >
                              <FaTrash size={18} />
                            </button>
                            {confirmDelete === category._id && (
                              <span className="text-xs text-red-500">Click again to confirm</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryList;
