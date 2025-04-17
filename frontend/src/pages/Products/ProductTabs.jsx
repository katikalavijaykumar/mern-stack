import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Ratings from "../Products/Ratings";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetTopProductsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { id: productId } = useParams();
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [sortedReviews, setSortedReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    // Check if user has already reviewed this product
    if (userInfo && product && product.reviews) {
      const userReviewExists = product.reviews.some(
        (review) => review.user.toString() === userInfo._id.toString()
      );
      setHasReviewed(userReviewExists);
    }

    // Sort reviews based on selected option
    if (product && product.reviews) {
      let reviewsCopy = [...product.reviews];
      
      switch (sortOption) {
        case "newest":
          reviewsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "highest":
          reviewsCopy.sort((a, b) => b.rating - a.rating);
          break;
        case "lowest":
          reviewsCopy.sort((a, b) => a.rating - b.rating);
          break;
        default:
          break;
      }
      
      setSortedReviews(reviewsCopy);
    }
  }, [product, userInfo, sortOption]);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const [createReview, { isLoading: loadingProductReview2 }] =
    useCreateReviewMutation();

  const submitHandler2 = async (e) => {
    e.preventDefault();

    if (rating === 0 || rating === "") {
      toast.error("Please select a rating");
      return;
    }
    
    if (comment.trim() === "") {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
      setHasReviewed(true);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap border-b border-gray-300 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 1
              ? "bg-primary-light dark:bg-primary-dark text-white"
              : "bg-gray-100 dark:bg-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          } rounded-t-md`}
          onClick={() => handleTabClick(1)}
        >
          Write a Review
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 2
              ? "bg-primary-light dark:bg-primary-dark text-white"
              : "bg-gray-100 dark:bg-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          } rounded-t-md`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 3
              ? "bg-primary-light dark:bg-primary-dark text-white" 
              : "bg-gray-100 dark:bg-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          } rounded-t-md`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 1 && (
          <div className="p-4 bg-white dark:bg-dark-card rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Customer Reviews</h2>

            {product.reviews.length === 0 ? (
              <Message>No Reviews</Message>
            ) : (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-200 mr-2">
                    {product.rating.toFixed(1)}
                  </span>
                  <div>
                    <Ratings value={product.rating} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Based on {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = product.reviews.filter(r => Math.round(r.rating) === star).length;
                    const percentage = product.numReviews > 0 
                      ? Math.round((count / product.numReviews) * 100) 
                      : 0;
                    
                    return (
                      <div key={star} className="flex items-center">
                        <span className="w-10 text-sm text-gray-600 dark:text-gray-400">{star} star</span>
                        <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-light dark:bg-primary-dark" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-10 text-right text-sm text-gray-600 dark:text-gray-400">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {sortedReviews.slice(0, 3).map((review) => (
                <div key={review._id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
                  <div className="flex justify-between">
                    <strong className="text-gray-800 dark:text-gray-200">{review.name}</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
              
              {product.reviews.length > 3 && (
                <button 
                  onClick={() => handleTabClick(2)}
                  className="text-primary-light dark:text-primary-dark hover:underline text-sm"
                >
                  View all {product.numReviews} reviews
                </button>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Write a Review</h2>

              {loadingProductReview && <Loader />}

              {userInfo ? (
                hasReviewed ? (
                  <Message variant="info">
                    Thank you for your review! You've already reviewed this product.
                  </Message>
                ) : (
                  <form onSubmit={submitHandler || submitHandler2} className="space-y-4">
                    <div className="mb-4">
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
                      >
                        Rating
                      </label>
                      <select
                        id="rating"
                        required
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
                      >
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        rows="3"
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-input"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingProductReview}
                      className="bg-primary-light dark:bg-primary-dark hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
                    >
                      Submit
                    </button>
                  </form>
                )
              ) : (
                <Message>
                  Please <Link to="/login" className="text-primary-light dark:text-primary-dark hover:underline">sign in</Link> to write a review
                </Message>
              )}
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="p-4 bg-white dark:bg-dark-card rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">All Reviews</h2>

            {product.reviews.length === 0 ? (
              <Message>No Reviews</Message>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Ratings value={product.rating} />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <label htmlFor="sortReviews" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                      Sort by:
                    </label>
                    <select
                      id="sortReviews"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-dark-secondary text-gray-800 dark:text-gray-200"
                    >
                      <option value="newest">Newest</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedReviews.map((review) => (
                    <div key={review._id} className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
                      <div className="flex justify-between">
                        <strong className="text-gray-800 dark:text-gray-200">{review.name}</strong>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Ratings value={review.rating} />
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="p-4 bg-white dark:bg-dark-card rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Related Products</h2>

            {isLoading ? (
              <Loader />
            ) : data && data.length === 0 ? (
              <Message>No Related Products</Message>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data &&
                  data.map((product) => (
                    <div key={product._id} className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <Link to={`/product/${product._id}`}>
                        <div className="h-40 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <h2 className="text-sm font-semibold mb-1 truncate text-gray-800 dark:text-gray-200">
                            {product.name}
                          </h2>
                          <div className="flex items-center mb-1">
                            <Ratings value={product.rating} />
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              ({product.numReviews} reviews)
                            </span>
                          </div>
                          <p className="font-semibold text-primary-light dark:text-primary-dark">
                            ${product.price}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
