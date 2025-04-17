import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "./Products/ProductCard";
import Ratings from "./Products/Ratings";
import { FaFilter, FaTimes } from "react-icons/fa";

const Shop = () => {
  const { keyword } = useParams();
  const [category, setCategory] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Prices array for filter options
  const prices = [
    {
      _id: 0,
      name: "Any",
      array: [],
    },
    {
      _id: 1,
      name: "₹0 to ₹100",
      array: [0, 100],
    },
    {
      _id: 2,
      name: "₹101 to ₹200",
      array: [101, 200],
    },
    {
      _id: 3,
      name: "₹201 to ₹300",
      array: [201, 300],
    },
    {
      _id: 4,
      name: "₹301 to ₹400",
      array: [301, 400],
    },
    {
      _id: 5,
      name: "More than ₹401",
      array: [401, 9999],
    },
  ];

  // Fetch categories using RTK Query
  const { data: categories, isLoading: categoryLoading, error: categoryError } = useFetchCategoriesQuery();

  // Fetch filtered products using RTK Query
  const { data: products, isLoading: productLoading, error: productError } = useGetFilteredProductsQuery({
    keyword,
    category,
    price: radio,
    ratings: selectedRating,
    checked,
  });

  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    const categoryIndex = checked.indexOf(categoryId);
    const newChecked = [...checked];

    if (categoryIndex === -1) {
      newChecked.push(categoryId);
    } else {
      newChecked.splice(categoryIndex, 1);
    }

    setChecked(newChecked);
  };

  // Handle price radio button change
  const handlePriceChange = (priceRange) => {
    setRadio(priceRange);
    setPriceFilter(priceRange.join("-"));
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  // Clear all filters
  const clearFilters = () => {
    setChecked([]);
    setRadio([]);
    setPriceFilter("");
    setSelectedRating(0);
  };

  // Toggle mobile filter visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {keyword ? `Search Results for "${keyword}"` : "Shop All Products"}
        </h1>
        <button 
          onClick={toggleFilter}
          className="md:hidden flex items-center space-x-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg"
        >
          <FaFilter /> <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar - Mobile */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
            isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleFilter}
        >
          <div 
            className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 p-4 overflow-y-auto transform transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
              <button 
                onClick={toggleFilter}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {/* Mobile Filter Content */}
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
                {categoryLoading ? (
                  <Loader />
                ) : categoryError ? (
                  <Message variant="danger">{categoryError.data.message || categoryError.error}</Message>
                ) : (
                  <div className="space-y-2">
                    {categories?.map((c) => (
                      <div key={c._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-mobile-${c._id}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          onChange={() => handleCategoryChange(c._id)}
                          checked={checked.includes(c._id)}
                        />
                        <label
                          htmlFor={`category-mobile-${c._id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {c.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prices */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Prices</h3>
                <div className="space-y-2">
                  {prices?.map((p) => (
                    <div key={p._id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-mobile-${p._id}`}
                        name="price-mobile"
                        className="h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                        onChange={() => handlePriceChange(p.array)}
                        checked={priceFilter === p.array.join("-")}
                      />
                      <label
                        htmlFor={`price-mobile-${p._id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {p.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ratings</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-mobile-${rating}`}
                        name="rating-mobile"
                        className="h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                        onChange={() => handleRatingChange(rating)}
                        checked={selectedRating === rating}
                      />
                      <label
                        htmlFor={`rating-mobile-${rating}`}
                        className="ml-2 flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Ratings value={rating} />
                        <span>{rating === 1 ? "& above" : `& above`}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filter Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
              {(checked.length > 0 || radio.length > 0 || selectedRating > 0) && (
                <button
                  className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Categories Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
                {categoryLoading ? (
                  <Loader />
                ) : categoryError ? (
                  <Message variant="danger">{categoryError.data.message || categoryError.error}</Message>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {categories?.map((c) => (
                      <div key={c._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${c._id}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          onChange={() => handleCategoryChange(c._id)}
                          checked={checked.includes(c._id)}
                        />
                        <label
                          htmlFor={`category-${c._id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {c.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Price Range</h3>
                <div className="space-y-2">
                  {prices?.map((p) => (
                    <div key={p._id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${p._id}`}
                        name="price"
                        className="h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                        onChange={() => handlePriceChange(p.array)}
                        checked={priceFilter === p.array.join("-")}
                      />
                      <label
                        htmlFor={`price-${p._id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {p.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ratings</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="rating"
                        className="h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                        onChange={() => handleRatingChange(rating)}
                        checked={selectedRating === rating}
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="ml-2 flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Ratings value={rating} />
                        <span>{rating === 1 ? "& above" : `& above`}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {productLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : productError ? (
            <Message variant="danger">
              {productError.data?.message || productError.error}
            </Message>
          ) : products?.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300">No products found. Try different filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300">
                  Showing {products?.length} product{products?.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center space-x-2">
                  {checked.length > 0 && (
                    <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {checked.length} {checked.length === 1 ? 'category' : 'categories'}
                    </span>
                  )}
                  {radio.length > 0 && (
                    <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      Price filter
                    </span>
                  )}
                  {selectedRating > 0 && (
                    <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {selectedRating}★ & above
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
