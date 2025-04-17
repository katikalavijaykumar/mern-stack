import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import { addToFavorites, removeFromFavorites } from "../../redux/features/favorites/favoriteSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const [favorite, setFavorite] = useState(
    favorites.some(p => p._id === product?._id) || false
  );

  // Format price with commas and currency symbol
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Handle the image URL - could be a relative path or a full URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/sample.jpg";
    
    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    // For local images that start with /uploads
    if (imagePath.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${imagePath}`;
    }
    
    // Default image path
    return imagePath;
  };

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        ...product,
        qty: 1,
      })
    );
    toast.success("Item added to cart");
  };

  const toggleFavoriteHandler = async () => {
    try {
      if (favorite) {
        dispatch(removeFromFavorites(product));
        setFavorite(false);
        toast.success("Removed from favorites");
      } else {
        dispatch(addToFavorites(product));
        setFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Please login to add favorites");
    }
  };

  // Calculate discount percentage if original price exists and is higher
  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Product image with favorite button and discount badge */}
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
        
        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={toggleFavoriteHandler}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center transition-colors hover:bg-white dark:hover:bg-gray-800"
        >
          {favorite ? (
            <FaHeart className="text-red-500" size={16} />
          ) : (
            <FaRegHeart className="text-gray-500 dark:text-gray-400" size={16} />
          )}
        </button>
      </div>
      
      {/* Product details */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {product.category.name}
          </p>
        )}
        
        {/* Ratings */}
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={12}
                className={
                  product.rating >= star
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({product.numReviews})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Add to cart button */}
          <button
            onClick={addToCartHandler}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
