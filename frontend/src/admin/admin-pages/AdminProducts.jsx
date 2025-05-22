import React, { useState, useEffect } from 'react';
import AdminCreateProductModal from '../admin-components/AdminCreateProductModal';


const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${apiUrl}fetchproducts`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products: ' + err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (formData) => {
        try {
            const response = await fetch(`${apiUrl}createproduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                // Refresh the products list
                await fetchProducts();
                console.log('Product created successfully');
            } else {
                throw new Error(result.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            throw error; // Re-throw to let the modal handle the error
        }
    };

    const filteredProducts = products.filter(product =>
        Object.values(product).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        return aValue.toString().localeCompare(bValue.toString());
    });

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center min-h-96">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <div className="mt-4 text-gray-600 text-center">Loading products...</div>
            </div>
        </div>
    );

    const ErrorState = () => (
        <div className="max-w-md mx-auto mt-16">
            <div className="bg-white border border-red-200 rounded-xl p-8 shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Error Loading Products</h3>
                <p className="text-gray-600 text-center mb-6">{error}</p>
                <button 
                    onClick={fetchProducts}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="max-w-md mx-auto mt-16">
            <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">
                    {searchTerm ? `No products match "${searchTerm}"` : 'No products available at the moment.'}
                </p>
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear search
                    </button>
                )}
            </div>
        </div>
    );

    const ProductCard = ({ product, index }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {product.name || product.product_name || `Product #${product.id || index + 1}`}
                </h3>
                
            </div>
            
            <div className="space-y-3">
                {product.price && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Price</span>
                        <span className="text-2xl font-bold text-green-600">₱{parseFloat(product.price).toFixed(2)}</span>
                    </div>
                )}
                
                {product.description && (
                    <div>
                        <span className="text-gray-600 font-medium block mb-1">Description</span>
                        <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">{product.description}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {product.category && (
                        <div>
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Category</span>
                            <p className="text-gray-900 font-medium">{product.category}</p>
                        </div>
                    )}
                    
                    {product.stock !== undefined && (
                        <div>
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Stock</span>
                            <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? product.stock : 'Out of Stock'}
                            </p>
                        </div>
                    )}
                </div>
                
            </div>
            
            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Edit
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    View Details
                </button>
            </div>
        </div>
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                            <p className="mt-2 text-gray-600">Manage and monitor your product inventory</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                            <button 
                                onClick={fetchProducts}
                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, category, description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="category">Category</option>
                                <option value="stock">Stock</option>
                                <option value="id">ID</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {sortedProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                Showing {sortedProducts.length} of {products.length} products
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedProducts.map((product, index) => (
                                <ProductCard key={product.id || index} product={product} index={index} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <AdminCreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProduct}
            />
        </div>
    );
};

export default AdminProducts;