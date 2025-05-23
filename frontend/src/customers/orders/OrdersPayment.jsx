import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Receipt,
  ArrowLeft,
  Truck,
  Home,
  AlertCircle
} from 'lucide-react';

const OrderPayment = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    paypalEmail: '',
    bankAccount: '',
    routingNumber: '',
    codAddress: '',
    codPhone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!orderId) return;

    const fetchPaymentData = async () => {
      setLoading(true);
      try {
        // Mock data - in real app, fetch from API using orderId
        const mockPaymentData = {
          orderId: orderId,
          orderTotal: 299.99,
          tax: 26.99,
          shipping: 15.00,
          subtotal: 258.00,
          currency: 'USD',
          paymentStatus: 'unpaid',
          paymentMethod: null,
          transactionId: null,
          paymentDate: null,
          refundAmount: 0,
          availablePaymentMethods: ['credit_card', 'paypal', 'bank_transfer', 'cod'],
          orderItems: [
            { 
              id: 1,
              name: 'Wireless Headphones', 
              quantity: 1, 
              price: 199.99,
              image: '/api/placeholder/60/60'
            },
            { 
              id: 2,
              name: 'Phone Case', 
              quantity: 2, 
              price: 29.00,
              image: '/api/placeholder/60/60'
            }
          ],
          customerInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567'
          },
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        };

        setTimeout(() => {
          setPaymentData(mockPaymentData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [orderId]);

  const validateForm = () => {
    const newErrors = {};

    if (selectedPaymentMethod === 'credit_card') {
      if (!paymentForm.cardNumber.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!paymentForm.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      
      if (!paymentForm.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date format';
      }
      
      if (!paymentForm.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (paymentForm.cvv.length < 3) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }

    if (selectedPaymentMethod === 'paypal') {
      if (!paymentForm.paypalEmail) {
        newErrors.paypalEmail = 'PayPal email is required';
      } else if (!/\S+@\S+\.\S+/.test(paymentForm.paypalEmail)) {
        newErrors.paypalEmail = 'Invalid email format';
      }
    }

    if (selectedPaymentMethod === 'bank_transfer') {
      if (!paymentForm.bankAccount) {
        newErrors.bankAccount = 'Bank account number is required';
      }
      if (!paymentForm.routingNumber) {
        newErrors.routingNumber = 'Routing number is required';
      }
    }

    if (selectedPaymentMethod === 'cod') {
      if (!paymentForm.codAddress.trim()) {
        newErrors.codAddress = 'Delivery address is required';
      }
      if (!paymentForm.codPhone.trim()) {
        newErrors.codPhone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
    }
    return cleanValue;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm(prev => ({
      ...prev,
      cardNumber: formatted
    }));
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentForm(prev => ({
      ...prev,
      expiryDate: formatted
    }));
    
    if (errors.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: '' }));
    }
  };

  const processPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      setPaymentData(prev => ({
        ...prev,
        paymentStatus: selectedPaymentMethod === 'cod' ? 'cod_confirmed' : 'paid',
        paymentMethod: selectedPaymentMethod,
        transactionId: transactionId,
        paymentDate: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentData(prev => ({
        ...prev,
        paymentStatus: 'failed'
      }));
    } finally {
      setProcessing(false);
    }
  };

  const refundPayment = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentData(prev => ({
        ...prev,
        paymentStatus: 'refunded',
        refundAmount: prev.orderTotal
      }));
    } catch (error) {
      console.error('Refund error:', error);
      alert('Refund failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'cod_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'unpaid':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'cod_confirmed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'unpaid':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentMethodName = (method) => {
    const names = {
      'credit_card': 'Credit Card',
      'paypal': 'PayPal',
      'bank_transfer': 'Bank Transfer',
      'cod': 'Cash on Delivery'
    };
    return names[method] || method;
  };

  const handleBackToOrders = () => {
    navigate('/customer/orders');
  };

  const handleTrackOrder = () => {
    navigate(`/customer/orders/${orderId}/status`);
  };

  if (loading || !paymentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBackToOrders}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Payment</h1>
            <p className="text-gray-600">Complete your payment for order {paymentData.orderId}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(paymentData.paymentStatus)}`}>
          {getPaymentStatusIcon(paymentData.paymentStatus)}
          <span className="ml-2 capitalize">
            {paymentData.paymentStatus === 'cod_confirmed' ? 'COD Confirmed' : paymentData.paymentStatus}
          </span>
        </span>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Order ID:</span>
                <span className="font-medium">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span>${paymentData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax:</span>
                <span>${paymentData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping:</span>
                <span>${paymentData.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-semibold">${paymentData.orderTotal.toFixed(2)} {paymentData.currency}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Order Items</h4>
            <div className="space-y-3">
              {paymentData.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {paymentData.paymentStatus === 'paid' || paymentData.paymentStatus === 'cod_confirmed' ? (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium text-green-800">
                Payment Method: {getPaymentMethodName(paymentData.paymentMethod)}
              </span>
            </div>
            {paymentData.transactionId && (
              <div className="mt-2 text-sm text-green-700">
                Transaction ID: {paymentData.transactionId}
              </div>
            )}
            {paymentData.paymentDate && (
              <div className="text-sm text-green-700">
                Payment Date: {new Date(paymentData.paymentDate).toLocaleString()}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Payment Methods */}
      {paymentData.paymentStatus === 'unpaid' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {paymentData.availablePaymentMethods.map(method => (
              <button
                key={method}
                onClick={() => setSelectedPaymentMethod(method)}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  selectedPaymentMethod === method
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  {method === 'credit_card' && <CreditCard className="w-6 h-6 mb-2" />}
                  {method === 'paypal' && <DollarSign className="w-6 h-6 mb-2" />}
                  {method === 'bank_transfer' && <Receipt className="w-6 h-6 mb-2" />}
                  {method === 'cod' && <Home className="w-6 h-6 mb-2" />}
                  <span className="text-sm font-medium">
                    {getPaymentMethodName(method)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Payment Forms */}
          {selectedPaymentMethod === 'credit_card' && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); processPayment(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    className={`w-full border rounded px-3 py-2 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    value={paymentForm.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    className={`w-full border rounded px-3 py-2 ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                    value={paymentForm.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    className={`w-full border rounded px-3 py-2 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                    value={paymentForm.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    className={`w-full border rounded px-3 py-2 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                    value={paymentForm.cvv}
                    onChange={handleInputChange}
                    maxLength={4}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={processing}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay $${paymentData.orderTotal.toFixed(2)}`
                )}
              </button>
            </form>
          )}

          {selectedPaymentMethod === 'paypal' && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); processPayment(); }}>
              <div>
                <label className="block text-sm font-medium mb-1">PayPal Email</label>
                <input
                  type="email"
                  name="paypalEmail"
                  className={`w-full border rounded px-3 py-2 ${errors.paypalEmail ? 'border-red-500' : 'border-gray-300'}`}
                  value={paymentForm.paypalEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
                {errors.paypalEmail && <p className="text-red-500 text-sm mt-1">{errors.paypalEmail}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay $${paymentData.orderTotal.toFixed(2)} with PayPal`}
              </button>
            </form>
          )}

          {selectedPaymentMethod === 'bank_transfer' && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); processPayment(); }}>
              <div>
                <label className="block text-sm font-medium mb-1">Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccount"
                  className={`w-full border rounded px-3 py-2 ${errors.bankAccount ? 'border-red-500' : 'border-gray-300'}`}
                  value={paymentForm.bankAccount}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                />
                {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Routing Number</label>
                <input
                  type="text"
                  name="routingNumber"
                  className={`w-full border rounded px-3 py-2 ${errors.routingNumber ? 'border-red-500' : 'border-gray-300'}`}
                  value={paymentForm.routingNumber}
                  onChange={handleInputChange}
                  placeholder="Routing Number"
                />
                {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay $${paymentData.orderTotal.toFixed(2)} via Bank Transfer`}
              </button>
            </form>
          )}

          {selectedPaymentMethod === 'cod' && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); processPayment(); }}>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">Cash on Delivery</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  You will pay ${paymentData.orderTotal.toFixed(2)} in cash when your order is delivered.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Address</label>
                <textarea
                  name="codAddress"
                  className={`w-full border rounded px-3 py-2 h-20 ${errors.codAddress ? 'border-red-500' : 'border-gray-300'}`}
                  value={paymentForm.codAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete delivery address"
                />
                {errors.codAddress && <p className="text-red-500 text-sm mt-1">{errors.codAddress}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="codPhone"
                  className={`w-full border rounded px-3 py-2 ${errors.codPhone ? 'border-red-500' : 'border-gray-300'}`}
                  value={paymentForm.codPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.codPhone && <p className="text-red-500 text-sm mt-1">{errors.codPhone}</p>}
              </div>
              
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                disabled={processing}
              >
                {processing ? 'Confirming...' : 'Confirm Cash on Delivery'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Success/Failure States */}
      {(paymentData.paymentStatus === 'paid' || paymentData.paymentStatus === 'cod_confirmed') && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              {paymentData.paymentStatus === 'cod_confirmed' ? 'Order Confirmed!' : 'Payment Successful!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {paymentData.paymentStatus === 'cod_confirmed' 
                ? 'Your cash on delivery order has been confirmed. You will pay when the order is delivered.'
                : 'Thank you for your payment. Your order is now being processed.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleTrackOrder}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Truck className="w-4 h-4 mr-2" />
                Track Order
              </button>
              <button
                onClick={handleBackToOrders}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Receipt className="w-4 h-4 mr-2" />
                View All Orders
              </button>
            </div>
            
            {paymentData.paymentStatus === 'paid' && (
              <button
                onClick={refundPayment}
                disabled={processing}
                className="mt-4 px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
              >
                {processing ? 'Processing...' : 'Request Refund'}
              </button>
            )}
          </div>
        </div>
      )}

      {paymentData.paymentStatus === 'failed' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">
              Unfortunately, your payment could not be processed. Please try again or use a different payment method.
            </p>
            <button
              onClick={() => setPaymentData(prev => ({ ...prev, paymentStatus: 'unpaid' }))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {paymentData.paymentStatus === 'refunded' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Payment Refunded</h3>
            <p className="text-gray-600 mb-2">
              Refund Amount: ${paymentData.refundAmount.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm">
              The refund will be processed back to your original payment method within 3-5 business days.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPayment;