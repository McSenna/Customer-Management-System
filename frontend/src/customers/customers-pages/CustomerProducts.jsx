import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Eye, Filter, Search, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [navigating, setNavigating] = useState(false);

  const navigate = useNavigate();
  const customerId = sessionStorage.getItem('customer_id');
  const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';
  const baseUrl = 'http://localhost/customer-management-system/backend/';

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

  useEffect(() => {
    fetchProducts();
    if (customerId) {
      fetchCart();
    } else {
      showMessage('Session expired. Please log in again.', true);
      navigate('/login');
    }
  }, [customerId, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}fetchproducts`);
      const data = await response.json();
      if (data.error) {
        showMessage(data.message || 'Failed to load products', true);
        setProducts([]);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      showMessage('Error fetching products', true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
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
        showMessage(data.message || 'Failed to load cart', true);
      }
    } catch (error) {
      showMessage('Error fetching cart', true);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await fetch(`${apiUrl}add_to_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, product_id: product.id, quantity })
      });
      const data = await response.json();
      if (!data.error) {
        await fetchCart();
        showMessage('Added to cart!');
      } else {
        showMessage(data.message || 'Failed to add to cart', true);
      }
    } catch (error) {
      showMessage('Error adding to cart', true);
    }
  };

  const buyNow = async (product) => {
    try {
      await addToCart(product);
      const response = await fetch(`${apiUrl}create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          cart_items: [{ product_id: product.id, quantity: 1 }]
        })
      });
      const data = await response.json();
      if (!data.error) {
        navigate(`/customer/orders/${data.purchase_id}/payment`);
      } else {
        showMessage(data.message || 'Failed to create order', true);
      }
    } catch (error) {
      showMessage('Error creating order', true);
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'under50' && product.price < 50) ||
      (priceRange === '50to100' && product.price >= 50 && product.price <= 100) ||
      (priceRange === 'over100' && product.price > 100);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4.5);
    const hasHalfStar = (rating || 4.5) % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating || 4.5);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const getImageUrl = (product) => {
    if (product.product_image) {
      let imagePath = product.product_image;
      if (!imagePath.startsWith('http')) {
        imagePath = `${baseUrl}${imagePath}`;
      }
      return imagePath;
    }
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop';
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setSelectedProduct(null);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleViewCart = async () => {
    setNavigating(true);
    try {
      await fetchCart(); // Refresh cart before navigating
      navigate('/customer/cart');
    } catch (error) {
      showMessage('Error navigating to cart', true);
    } finally {
      setNavigating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto absolute top-0"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Search and Filters Section */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters and View Toggle Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              {showFilters && (
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports</option>
                    <option value="food">Food & Beverage</option>
                  </select>

                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Prices</option>
                    <option value="under50">Under $50</option>
                    <option value="50to100">$50 - $100</option>
                    <option value="over100">Over $100</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products
              </span>

              <div className="flex items-center ml-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary (if items exist) */}
      {cart.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">
                  {getTotalCartItems()} items in cart
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-900">
                  {formatPrice(getTotalCartValue())}
                </span>
                <button
                  onClick={handleViewCart}
                  disabled={navigating}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
                    navigating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {navigating ? 'Loading...' : 'View Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop';
                    }}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => openQuickView(product)}
                      className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300"
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      Quick View
                    </button>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
                  >
                    <Heart className={`w-4 h-4 ${
                      wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} />
                  </button>

                  {/* Badges */}
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}

                  {product.stocks < 10 && product.stocks > 0 && (
                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Only {product.stocks} left!
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name || 'Unnamed Product'}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex">{getRatingStars(product.rating)}</div>
                    <span className="ml-2 text-xs text-gray-500">
                      ({product.reviews || Math.floor(Math.random() * 50) + 10})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center">
                      <Truck className="w-3 h-3 mr-1 text-green-500" />
                      <span>Free Ship</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 mr-1 text-blue-500" />
                      <span>Warranty</span>
                    </div>
                    <div className="flex items-center">
                      <RotateCcw className="w-3 h-3 mr-1 text-purple-500" />
                      <span>Returns</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 flex"
              >
                {/* Product Image */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop';
                    }}
                  />

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
                  >
                    <Heart className={`w-4 h-4 ${
                      wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} />
                  </button>
                </div>

                {/* Product Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name || 'Unnamed Product'}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex">{getRatingStars(product.rating)}</div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({product.reviews || Math.floor(Math.random() * 50) + 10} reviews)
                      </span>
                    </div>

                    {product.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-1 text-green-500" />
                        <span>Free Shipping</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1 text-blue-500" />
                        <span>2Y Warranty</span>
                      </div>
                      <div className="flex items-center">
                        <RotateCcw className="w-4 h-4 mr-1 text-purple-500" />
                        <span>30D Return</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="ml-3 text-lg text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openQuickView(product)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => buyNow(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products Found */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleViewCart}
            disabled={navigating}
            className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 ${
              navigating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center">
              <ShoppingCart className="w-6 h-6" />
              <div className="ml-3 text-left">
                <div className="font-bold text-sm">{getTotalCartItems()}</div>
                <div className="text-xs opacity-90">{formatPrice(getTotalCartValue())}</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              {getTotalCartItems()}
            </div>
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={getImageUrl(selectedProduct)}
                  alt={selectedProduct.name || 'Product'}
                  className="w-full h-80 md:h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop';
                  }}
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <button
                    onClick={closeQuickView}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex">{getRatingStars(selectedProduct.rating)}</div>
                  <span className="ml-2 text-gray-600">
                    ({selectedProduct.reviews || Math.floor(Math.random() * 50) + 10} reviews)
                  </span>
                </div>

                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.original_price && (
                    <span className="ml-3 text-xl text-gray-500 line-through">
                      {formatPrice(selectedProduct.original_price)}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeQuickView();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      buyNow(selectedProduct);
                      closeQuickView();
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-1 text-green-500" />
                    Free Shipping
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-blue-500" />
                    2Y Warranty
                  </div>
                  <div className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-1 text-purple-500" />
                    30D Return
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;