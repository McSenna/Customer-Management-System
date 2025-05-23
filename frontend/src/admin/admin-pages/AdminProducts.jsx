import React, { useState, useEffect } from 'react';
import axios from "axios";
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
            
            const response = await axios.get(`${apiUrl}fetchproducts`);
            
            // Axios automatically throws for HTTP error status codes (4xx, 5xx)
            // No need to check response.ok as that's for fetch API
            
            setProducts(response.data); // Axios stores response data in .data property
        } catch (err) {
            setError('Failed to fetch products: ' + err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (formData) => {
        try {
            // Using axios.post with proper configuration
            const response = await axios.post(`${apiUrl}createproduct`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Axios automatically parses JSON response
            const result = response.data;
            
            if (result.success) {
                await fetchProducts();
                console.log('Product created successfully');
            } else {
                throw new Error(result.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
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
        <div className="flex justify-center items-center py-24">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="mt-6 text-slate-600 font-medium text-center">Loading products...</div>
            </div>
        </div>
    );

    const ErrorState = () => (
        <div className="text-center py-24">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
            <button 
                onClick={fetchProducts}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Try Again
            </button>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {searchTerm ? 'No matches found' : 'No products yet'}
            </h3>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                {searchTerm ? `No products match "${searchTerm}". Try adjusting your search.` : 'Start building your inventory by adding your first product.'}
            </p>
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear search
                </button>
            )}
        </div>
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
            {/* Modern Header with Glassmorphism */}
            <div className="top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Product Management</h1>
                            <p className="text-slate-600 text-lg">Streamline your inventory with intelligent controls</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={fetchProducts}
                                className="group flex items-center gap-2 bg-white/70 backdrop-blur-sm hover:bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-5 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Search & Filter Panel */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Search Products</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search by name, category, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white/70 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 font-medium shadow-sm group-hover:shadow-md"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                                    <svg className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full py-4 px-6 bg-white/70 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <option value="name">Product Name</option>
                                <option value="price">Price</option>
                                <option value="category">Category</option>
                                <option value="stock">Stock Level</option>
                                <option value="id">Product ID</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Data Table */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden">
                    {sortedProducts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {/* Table Header with Stats */}
                            <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
                                            <span className="text-sm font-medium text-slate-600">Total Products</span>
                                            <div className="text-2xl font-bold text-slate-900">{products.length}</div>
                                        </div>
                                        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
                                            <span className="text-sm font-medium text-slate-600">Showing</span>
                                            <div className="text-2xl font-bold text-indigo-600">{sortedProducts.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/60">
                                                Product Details
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/60">
                                                Category
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/60">
                                                Price
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/60">
                                                Stock Status
                                            </th>
                                            <th className="px-8 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/60">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/60">
                                        {sortedProducts.map((product, index) => (
                                            <tr key={product.id || index} className="group hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-base font-semibold text-slate-900 mb-1">
                                                                {product.name || product.product_name || `Product #${product.id || index + 1}`}
                                                            </div>
                                                            {product.description && (
                                                                <p className="text-sm text-slate-600 line-clamp-2 max-w-md">
                                                                    {product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    {product.category ? (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                                            {product.category}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm font-medium">No category</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6">
                                                    {product.price ? (
                                                        <div className="text-lg font-bold text-slate-900">
                                                            ₱{parseFloat(product.price).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm font-medium">Not set</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6">
                                                    {product.stocks !== undefined ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${product.stocks > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                                product.stock > 0 
                                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                            }`}>
                                                                {product.stocks > 0 ? `${product.stocks} units` : 'Out of stock'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-sm font-medium">Unknown</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-105">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200 transform hover:scale-105">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
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