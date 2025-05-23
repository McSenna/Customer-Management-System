import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });

    const [productImage, setProductImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const categories = [
        'Electronics',
        'Mobile Phone',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports & Outdoors',
        'Beauty & Health',
        'Toys & Games',
        'Food & Beverages',
        'Automotive',
        'Office Supplies',
        'Jewelry & Accessories',
        'Pet Supplies'
    ];

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (submitError) {
            setSubmitError('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Invalid file type. Only JPG, JPEG, PNG, GIF are allowed.'
                }));
                return;
            }

            // Validate file size (2MB)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    image: 'File size exceeds 2MB limit.'
                }));
                return;
            }

            setProductImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Clear any previous image errors
            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        }
    };

    const removeImage = () => {
        setProductImage(null);
        setImagePreview(null);
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Product name must be at least 3 characters';
        }
        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        } else if (parseFloat(formData.price) > 999999.99) {
            newErrors.price = 'Price cannot exceed ₱999,999.99';
        }
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }
        if (!formData.stock && formData.stock !== '0') {
            newErrors.stock = 'Stock quantity is required';
        } else if (parseInt(formData.stock) < 0) {
            newErrors.stock = 'Stock quantity cannot be negative';
        } else if (parseInt(formData.stock) > 999999) {
            newErrors.stock = 'Stock quantity cannot exceed 999,999';
        }
        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setSubmitError('');
        
        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', parseInt(formData.stock));
            
            // Add image if selected
            if (productImage) {
                formDataToSend.append('product_image', productImage);
            }

            console.log('Sending product data with image...');

            const response = await axios.post(`${apiUrl}addproducts`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000 // 30 second timeout for file upload
            });
            
            console.log('Response:', response.data);
            
            if (response.data.type === 'success') {
                // Success - call the callback to refresh the product list
                if (onProductCreated) {
                    onProductCreated(response.data);
                }
                resetForm();
                onClose();
            } else {
                // Server returned an error
                setSubmitError(response.data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                
                if (error.response.data && error.response.data.message) {
                    setSubmitError(error.response.data.message);
                } else if (error.response.status === 500) {
                    setSubmitError('Server error. Please check the server logs.');
                } else if (error.response.status === 404) {
                    setSubmitError('API endpoint not found. Please check your API URL.');
                } else {
                    setSubmitError(`Server error (${error.response.status}). Please try again.`);
                }
            } else if (error.request) {
                console.error('Request error:', error.request);
                setSubmitError('No response from server. Please check your connection and server status.');
            } else {
                console.error('Setup error:', error.message);
                setSubmitError('Request setup error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: ''
        });
        setProductImage(null);
        setImagePreview(null);
        setErrors({});
        setSubmitError('');
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !loading) {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, loading]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            ></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[93vh] transform transition-all duration-300 scale-100 overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                        <p className="text-sm text-gray-600 mt-1">Product code will be auto-generated</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {submitError && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-medium text-red-800">Error creating product</h4>
                                <p className="text-sm text-red-700 mt-1">{submitError}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                            <span className="text-gray-500 font-normal ml-1">(JPG, PNG, GIF - Max 2MB)</span>
                        </label>
                        
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="product-image-input"
                                    disabled={loading}
                                />
                                <label
                                    htmlFor="product-image-input"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    disabled={loading}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    {productImage?.name}
                                </div>
                            </div>
                        )}
                        
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.image}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            maxLength={100}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter product name"
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                            <span className="text-gray-500 font-normal ml-1">
                                ({formData.description.length}/500)
                            </span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            maxLength={500}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter product description (optional)"
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₱) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min="0"
                                max="999999.99"
                                step="0.01"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                                disabled={loading}
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                max="999999"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0"
                                disabled={loading}
                            />
                            {errors.stock && (
                                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateProductModal;