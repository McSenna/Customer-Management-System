import React, { useState } from 'react';
import axios from 'axios';
import { X, UserPlus, Mail, Phone, User, MapPin, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

const CreateAccountModal = ({ isOpen = true, onClose = () => {}, onCustomerCreated = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare data for API call (exclude confirmPassword)
      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      };

      // Make API call to your PHP backend
      const response = await axios.post(`${apiUrl}add`, customerData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Check if the response indicates success
      if (response.data.type === 'success') {
        setSuccess('Account created successfully!');
        
        // Wait a moment to show success message, then close
        setTimeout(() => {
          const resetForm = {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: ''
          };
          setFormData(resetForm);
          setSuccess('');
          setIsSubmitting(false);
          onCustomerCreated({
            ...customerData,
            id: response.data.id
          });
          onClose();
        }, 1500);
      } else {
        // Handle API error response
        setError(response.data.message || 'Failed to create account');
        setIsSubmitting(false);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error creating customer:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(`Network error: ${error.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-150 overflow-auto">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Create Account</h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-white hover:text-blue-200 transition-colors p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Compact Form */}
        <div className="p-4">
          <div>
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded mb-3 flex items-center text-sm">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded mb-3 flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                  <User className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone"
                  />
                  <Phone className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Password"
                    />
                    <Lock className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                    Confirm *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm"
                    />
                    <Lock className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                  Address (Optional)
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Enter address"
                  />
                  <MapPin className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-white"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Compact Terms */}
            <p className="text-xs text-gray-500 text-center mt-3">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountModal;