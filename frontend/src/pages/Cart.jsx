import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart, clearCartItems } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.error("Item removed from cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const clearCartHandler = () => {
    dispatch(clearCartItems());
    toast.error("Cart cleared", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const taxAmount = (totalPrice * 0.15).toFixed(2);
  const shippingAmount = (totalPrice > 100 ? 0 : 10).toFixed(2);
  const grandTotal = (Number(totalPrice) + Number(taxAmount) + Number(shippingAmount)).toFixed(2);

  // Handle image URL correctly based on format
  const getImageUrl = (image) => {
    return image.startsWith('http') 
      ? image 
      : `http://localhost:5000${image}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.png';
                                  e.target.onerror = null;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <Link 
                                to={`/product/${item._id}`}
                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400"
                              >
                                {item.name}
                              </Link>
                              {item.brand && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.brand}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
                            <button
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-md transition-colors"
                              onClick={() => item.qty > 1 && addToCartHandler(item, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                              {item.qty}
                            </span>
                            <button
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-md transition-colors"
                              onClick={() => item.qty < item.countInStock && addToCartHandler(item, item.qty + 1)}
                              disabled={item.qty >= item.countInStock}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            onClick={() => removeFromCartHandler(item._id)}
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right">
                <button
                  className="px-4 py-2 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center space-x-1 transition-colors"
                  onClick={clearCartHandler}
                >
                  <FaTrash size={14} />
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span className="text-gray-900 dark:text-white font-medium">${totalPrice}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">Tax (15%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">${taxAmount}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {shippingAmount === '0.00' ? 'Free' : `$${shippingAmount}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-900 dark:text-white font-bold">Total</span>
                  <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">${grandTotal}</span>
                </div>
              </div>
              
              <button
                type="button"
                className="w-full mt-6 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                <p>Free shipping on orders over $100</p>
                <p className="mt-1">Taxes calculated at checkout</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
