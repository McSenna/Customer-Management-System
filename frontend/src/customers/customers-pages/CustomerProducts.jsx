import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Eye, Plus, Minus, Filter, Search, Grid, List } from 'lucide-react';

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

    useEffect(() => {
        fetchProducts();
    }, []);

    // Updated API configuration - adjust these paths according to your setup
    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';
    const baseUrl = 'http://localhost/customer-management-system/backend/';

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${apiUrl}fetchproducts`);
            const data = await response.json();
            
            // Check if there's an error in the response
            if (data.error) {
                console.error('API Error:', data.message);
                setProducts([]);
            } else {
                console.log('Fetched products:', data);
                setProducts(Array.isArray(data) ? data : []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoading(false);
        }
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

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(prev => prev.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart(prev => [...prev, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price || 0);
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
            // Clean the image path to avoid double slashes or incorrect paths
            let imagePath = product.product_image;
            
            // If the path doesn't start with uploads/, add the base URL
            if (!imagePath.startsWith('http')) {
                imagePath = `${baseUrl}${imagePath}`;
            }
            
            console.log('Final Image URL:', imagePath);
            return imagePath;
        }
        
        // Fallback image
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-32 w-32 border-4 border-orange-200 mx-auto"></div>
                        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-orange-500 mx-auto absolute top-0"></div>
                    </div>
                    <p className="mt-6 text-lg text-gray-600 font-medium">Loading amazing products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            {/* Enhanced Header */}
            <div className="bg-white shadow-lg border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                Our Products
                            </h1>
                            <p className="text-gray-600 mt-1">Discover amazing products with unbeatable deals</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                                <Search className="w-5 h-5 text-gray-500 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none outline-none text-gray-700 w-64"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </button>
                            
                            {showFilters && (
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="all">All Prices</option>
                                        <option value="under50">Under $50</option>
                                        <option value="50to100">$50 - $100</option>
                                        <option value="over100">Over $100</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-sm text-gray-600">
                            Showing {filteredProducts.length} products
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid/List */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                    : "space-y-6"
                }>
                    {filteredProducts.map((product) => (
                        <div key={product.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 ${
                            viewMode === 'list' ? 'flex' : ''
                        }`}>
                            {/* Product Image */}
                            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                                <img 
                                    src={getImageUrl(product)}
                                    alt={product.name || 'Product'}
                                    className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                                        viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                                    }`}
                                    onError={(e) => {
                                        console.log('Image failed to load:', e.target.src);
                                        console.log('Product:', product);
                                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop';
                                    }}
                                />
                                
                                {/* Overlay buttons */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => openQuickView(product)}
                                        className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                                    >
                                        <Eye className="w-4 h-4 inline mr-2" />
                                        Quick View
                                    </button>
                                </div>

                                <button 
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
                                >
                                    <Heart 
                                        className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                                    />
                                </button>
                                
                                {product.discount && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                        -{product.discount}%
                                    </div>
                                )}

                                {product.stocks < 10 && product.stocks > 0 && (
                                    <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        Only {product.stocks} left!
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className={`p-6 ${viewMode === 'list' ? 'w-2/3 flex flex-col justify-between' : ''}`}>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-orange-600 cursor-pointer transition-colors">
                                        {product.name || 'Unnamed Product'}
                                    </h3>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center mb-3">
                                        <div className="flex">
                                            {getRatingStars(product.rating)}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600 font-medium">
                                            {product.rating || 4.5} ({product.reviews || Math.floor(Math.random() * 50) + 10} reviews)
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center mb-4">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.original_price && (
                                            <span className="ml-3 text-lg text-gray-500 line-through">
                                                {formatPrice(product.original_price)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {product.description && (
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Features */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6 bg-gray-50 rounded-lg p-3">
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

                                {/* Buttons */}
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-lg mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setPriceRange('all');
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Shopping Cart Indicator */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform cursor-pointer">
                        <div className="flex items-center">
                            <ShoppingCart className="w-6 h-6" />
                            <div className="ml-3">
                                <div className="font-bold text-lg">{getTotalCartItems()}</div>
                                <div className="text-sm opacity-90">{formatPrice(getTotalCartValue())}</div>
                            </div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                            {getTotalCartItems()}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick View Modal */}
            {showQuickView && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2">
                                <img 
                                    src={getImageUrl(selectedProduct)}
                                    alt={selectedProduct.name || 'Product'}
                                    className="w-full h-96 md:h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop';
                                    }}
                                />
                            </div>
                            <div className="md:w-1/2 p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                    <button 
                                        onClick={closeQuickView}
                                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div className="flex items-center mb-4">
                                    <div className="flex">
                                        {getRatingStars(selectedProduct.rating)}
                                    </div>
                                    <span className="ml-2 text-gray-600">
                                        ({selectedProduct.reviews || Math.floor(Math.random() * 50) + 10} reviews)
                                    </span>
                                </div>
                                
                                <div className="flex items-center mb-6">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {formatPrice(selectedProduct.price)}
                                    </span>
                                    {selectedProduct.original_price && (
                                        <span className="ml-3 text-xl text-gray-500 line-through">
                                            {formatPrice(selectedProduct.original_price)}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                                    {selectedProduct.description}
                                </p>
                                
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => {
                                            addToCart(selectedProduct);
                                            closeQuickView();
                                        }}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg">
                                        Buy Now
                                    </button>
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