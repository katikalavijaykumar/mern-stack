import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaSave } from "react-icons/fa";
import AdminLayout from './AdminLayout';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

const ProductList = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    countInStock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const navigate = useNavigate();

  // RTK Query hooks
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct, { isLoading: isCreating, error: createError, isSuccess }] = useCreateProductMutation();
  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useFetchCategoriesQuery();

  // Clear form and messages when creation is successful
  useEffect(() => {
    if (isSuccess) {
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        countInStock: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setFormErrors({});
    }
  }, [isSuccess]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Basic validation as the user types
    let errors = { ...formErrors };
    
    switch (name) {
      case 'price':
      case 'countInStock':
        if (isNaN(value) || value < 0) {
          errors[name] = `${name === 'price' ? 'Price' : 'Stock count'} must be a positive number`;
        } else {
          delete errors[name];
        }
        break;
      case 'name':
        if (value.trim().length === 0) {
          errors[name] = 'Product name is required';
        } else {
          delete errors[name];
        }
        break;
      default:
        // Clear error if field is now valid
        if (value.trim().length > 0) {
          delete errors[name];
        }
    }
    
    setFormErrors(errors);
    setProductData({ ...productData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormErrors({
        ...formErrors,
        image: 'Only JPEG, PNG, JPG, and WEBP formats are allowed'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        image: 'Image size must be less than 5MB'
      });
      return;
    }

    // Clear image error
    const updatedErrors = { ...formErrors };
    delete updatedErrors.image;
    setFormErrors(updatedErrors);

    // Set file and create preview
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!productData.name.trim()) errors.name = 'Product name is required';
    if (!productData.description.trim()) errors.description = 'Description is required';
    if (!productData.price) errors.price = 'Price is required';
    if (!productData.category) errors.category = 'Category is required';
    if (!productData.brand.trim()) errors.brand = 'Brand is required';
    if (!productData.countInStock) errors.countInStock = 'Stock count is required';
    
    // Image validation
    if (!imageFile) errors.image = 'Product image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsFormSubmitting(true);
    
    try {
      // Prepare form data for API call
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("brand", productData.brand);
      formData.append("countInStock", productData.countInStock);

      // Create product via API
      const { data } = await createProduct(formData).unwrap();
      
      toast.success(`${data.name} created successfully`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error(error?.data?.message || "Failed to create product. Please try again.");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create New Product</h1>
        
        {createError && (
          <Message variant="danger" className="mb-6">
            {createError?.data?.message || "Error creating product"}
          </Message>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <label 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Product Image
                  </label>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={imagePreview} 
                            alt="Product preview" 
                            className="max-h-64 max-w-full mb-4 rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <>
                          <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-500 hover:text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                            >
                              <span>Upload an image</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, JPEG or WEBP up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {formErrors.image && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.image}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Basic Information */}
              <div>
                <div className="mb-4">
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Product Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={productData.name} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-primary-500 
                      bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="price" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Price
                  </label>
                  <input 
                    type="number" 
                    id="price" 
                    name="price"
                    value={productData.price} 
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-primary-500 
                      bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter price"
                  />
                  {formErrors.price && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="brand" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Brand
                  </label>
                  <input 
                    type="text" 
                    id="brand" 
                    name="brand"
                    value={productData.brand} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-primary-500 
                      bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter brand name"
                  />
                  {formErrors.brand && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.brand}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Additional Information */}
              <div>
                <div className="mb-4">
                  <label 
                    htmlFor="category" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Category
                  </label>
                  {isCategoriesLoading ? (
                    <Loader size="small" />
                  ) : categoriesError ? (
                    <Message variant="danger">
                      {categoriesError?.data?.message || "Error loading categories"}
                    </Message>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-primary-500 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.category && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.category}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="countInStock" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Count In Stock
                  </label>
                  <input 
                    type="number" 
                    id="countInStock" 
                    name="countInStock"
                    value={productData.countInStock} 
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-primary-500 
                      bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter stock quantity"
                  />
                  {formErrors.countInStock && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.countInStock}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Description - Full Width */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <label 
                    htmlFor="description" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea 
                    id="description" 
                    name="description"
                    value={productData.description} 
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-primary-500 
                      bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter product description"
                  />
                  {formErrors.description && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500 error-message">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-6">
              <button 
                type="submit" 
                disabled={isCreating || isFormSubmitting}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
                  transition-colors duration-200 flex items-center justify-center w-full md:w-auto"
              >
                {isCreating || isFormSubmitting ? (
                  <>
                    <Loader size="small" light />
                    <span className="ml-2">Creating...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductList;
