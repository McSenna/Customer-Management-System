import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Package, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem('customer_id');
  
  const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

  useEffect(() => {
    if (!customerId) {
      // Check if we're in a React Router environment
      if (navigate) {
        navigate('/login');
      } else {
        // Fallback to window.location if React Router is not available
        window.location.href = '/login';
      }
      return;
    }
    fetchCart();
  }, [customerId, navigate]);

  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`${apiUrl}get_cart&customer_id=${customerId}`);
      const data = await response.json();
      if (!data.error) {
        setCart(data.data.map(item => ({
          ...item,
          id: item.product_id,
          quantity: item.quantity
        })));
      } else {
        showMessage('Failed to load cart', true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showMessage('Failed to load cart', true);
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      const response = await fetch(`${apiUrl}update_cart_quantity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId, quantity: newQuantity })
      });
      const data = await response.json();
      if (!data.error) {
        await fetchCart();
        showMessage('Cart updated!');
      } else {
        showMessage(data.message || 'Failed to update cart', true);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showMessage('Failed to update cart', true);
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (cartId) => {
    setUpdating(true);
    try {
      const response = await fetch(`${apiUrl}remove_from_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId })
      });
      const data = await response.json();
      if (!data.error) {
        await fetchCart();
        showMessage('Item removed from cart!');
      } else {
        showMessage(data.message || 'Failed to remove item', true);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showMessage('Failed to remove item', true);
    } finally {
      setUpdating(false);
    }
  };

  const proceedToCheckout = async () => {
    if (cart.length === 0) return;
    
    setUpdating(true);
    try {
      const cartItems = cart.map(item => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity
      }));

      const response = await fetch(`${apiUrl}create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          cart_items: cartItems
        })
      });
      const data = await response.json();
      if (!data.error) {
        navigate(`/customer/orders/${data.purchase_id}/payment`);
      } else {
        showMessage(data.message || 'Failed to create order', true);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showMessage('Failed to create order', true);
    } finally {
      setUpdating(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);
  };

  const getImageUrl = (item) => {
    if (item.product_image) {
      let imagePath = item.product_image;
      if (!imagePath.startsWith('http')) {
        imagePath = `${baseUrl}${imagePath}`;
      }
      return imagePath;
    }
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto absolute top-0"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/customer/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Products
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-600">{getTotalItems()} items</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className={`p-4 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
            error ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error || success}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={() => navigate('/customer/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.cart_id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={getImageUrl(item)}
                            alt={item.name || 'Product'}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            onError={(e) => { 
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'; 
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {item.name || 'Product Name'}
                          </h4>
                          <p className="text-2xl font-bold text-blue-600 mb-4">
                            {formatPrice(item.price)}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                                disabled={updating || item.quantity <= 1}
                                className="w-10 h-10 rounded-md bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-semibold text-lg">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                disabled={updating}
                                className="w-10 h-10 rounded-md bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.cart_id)}
                              disabled={updating}
                              className="text-red-600 hover:text-red-700 disabled:text-red-400 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(getTotalPrice() * 0.08)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice() * 1.08)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  disabled={cart.length === 0 || updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{updating ? 'Processing...' : 'Proceed to Checkout'}</span>
                </button>

                <button
                  onClick={() => navigate('/customer/products')}
                  className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Benefits */}
                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Secure checkout process</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCart;