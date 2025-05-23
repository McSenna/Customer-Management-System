import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

const CustomerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${apiUrl}fetchproducts`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
        console.log('Added to cart:', product.name);
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
        }).format(price);
    };

    const getRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Our Products</h1>
                    <p className="text-gray-600 mt-1">Discover amazing products with great deals</p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                            {/* Product Image */}
                            <div className="relative overflow-hidden">
                                <img 
                                    src={
                                        product.product_image
                                            ? `http://localhost/customer-management-system/backend/${product.product_image.replace(/^[./]+/, '')}`
                                            : '/backend/uploads/products/default.png'
                                    }
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button 
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                                >
                                    <Heart 
                                        className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                                    />
                                </button>
                                {product.discount && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                        -{product.discount}%
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 cursor-pointer">
                                    {product.name}
                                </h3>
                                
                                {/* Rating */}
                                <div className="flex items-center mb-2">
                                    <div className="flex">
                                        {getRatingStars(product.rating || 4.5)}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        ({product.reviews || '127'})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center mb-3">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.original_price && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            {formatPrice(product.original_price)}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                {/* Features */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Truck className="w-4 h-4 mr-1" />
                                        <span>Free delivery</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Shield className="w-4 h-4 mr-1" />
                                        <span>Warranty</span>
                                    </div>
                                    <div className="flex items-center">
                                        <RotateCcw className="w-4 h-4 mr-1" />
                                        <span>30-day return</span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </button>
                                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Check back later for new products!</p>
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                    <div className="flex items-center">
                        <ShoppingCart className="w-6 h-6" />
                        <span className="ml-2 font-semibold">{cart.length}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerProducts;