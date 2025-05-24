import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, RefreshCw, Receipt, ArrowLeft, Truck, Home, AlertCircle } from 'lucide-react';

const OrderPayment = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const customerId = sessionStorage.getItem('customer_id');

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

  const apiUrl = 'http://localhost/customer-management-system/backend/';
  const baseUrl = 'http://localhost/customer-management-system/backend/';

  useEffect(() => {
    if (!orderId || !customerId) {
      navigate('/customer/products');
      return;
    }

    const fetchPaymentData = async () => {
      setLoading(true);
      try {
        // Fetch customer data
        const customerResponse = await fetch(`${apiUrl}get_customer&customer_id=${customerId}`);
        const customerData = await customerResponse.json();

        // Fetch order data
        const orderResponse = await fetch(`${apiUrl}orders?purchase_id=${orderId}`);
        const orderData = await orderResponse.json();

        if (customerData.error || orderData.error) {
          throw new Error('Failed to fetch data');
        }

        const paymentData = {
          orderId: orderId,
          orderTotal: orderData.total_amount,
          tax: orderData.total_amount * 0.1, // 10% tax
          shipping: 15.00,
          subtotal: orderData.total_amount,
          currency: 'USD',
          paymentStatus: orderData.payment_status || 'unpaid',
          paymentMethod: orderData.payment_method || 'credit_card',
          transactionId: null,
          paymentDate: null,
          refundAmount: 0,
          availablePaymentMethods: ['credit_card', 'paypal', 'bank_transfer', 'cod'],
          orderItems: [{
            id: orderData.product_id,
            name: orderData.product_name,
            quantity: orderData.quantity,
            price: orderData.price,
            image: orderData.product_image
          }],
          customerInfo: {
            name: customerData.data.name,
            email: customerData.data.email,
            phone: customerData.data.phone
          },
          shippingAddress: {
            street: customerData.data.address || '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        };

        setPaymentForm(prev => ({
          ...prev,
          cardName: customerData.data.name || '',
          billingAddress: customerData.data.address || '',
          codAddress: customerData.data.address || '',
          codPhone: customerData.data.phone || ''
        }));

        setPaymentData(paymentData);
        setSelectedPaymentMethod(paymentData.paymentMethod);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setErrors({ general: 'Failed to load order details' });
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [orderId, customerId, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (selectedPaymentMethod === 'credit_card') {
      if (!paymentForm.cardNumber.match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!paymentForm.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        newErrors.expiryDate = 'Expiry date must be MM/YY';
      }
      if (!paymentForm.cvv.match(/^\d{3,4}$/)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
      if (!paymentForm.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      if (!paymentForm.billingAddress.trim()) {
        newErrors.billingAddress = 'Billing address is required';
      }
      if (!paymentForm.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!paymentForm.zipCode.match(/^\d{5}$/)) {
        newErrors.zipCode = 'Zip code must be 5 digits';
      }
    } else if (selectedPaymentMethod === 'paypal') {
      if (!paymentForm.paypalEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        newErrors.paypalEmail = 'Valid PayPal email is required';
      }
    } else if (selectedPaymentMethod === 'bank_transfer') {
      if (!paymentForm.bankAccount.match(/^\d{10,12}$/)) {
        newErrors.bankAccount = 'Bank account number must be 10-12 digits';
      }
      if (!paymentForm.routingNumber.match(/^\d{9}$/)) {
        newErrors.routingNumber = 'Routing number must be 9 digits';
      }
    } else if (selectedPaymentMethod === 'cod') {
      if (!paymentForm.codAddress.trim()) {
        newErrors.codAddress = 'Delivery address is required';
      }
      if (!paymentForm.codPhone.match(/^\d{10}$/)) {
        newErrors.codPhone = 'Phone number must be 10 digits';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status in backend (assuming a payments table exists)
      const response = await fetch(`${apiUrl}update_payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchase_id: orderId,
          payment_status: 'paid',
          payment_method: selectedPaymentMethod,
          transaction_id: `TX${Date.now()}`,
          payment_date: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message);
      }

      setPaymentData(prev => ({
        ...prev,
        paymentStatus: 'paid',
        transactionId: `TX${Date.now()}`,
        paymentDate: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ general: 'Payment processing failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700">Order not found</p>
          <button
            onClick={() => navigate('/customer/orders')}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/customer/orders')}
          className="flex items-center text-orange-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="border-b pb-4 mb-4">
              {paymentData.orderItems.map(item => (
                <div key={item.id} className="flex items-center mb-4">
                  <img
                    src={`${baseUrl}${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop'; }}
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${paymentData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${paymentData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${paymentData.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(paymentData.subtotal + paymentData.tax + paymentData.shipping).toFixed(2)}</span>
              </div>
            </div>
          </div>
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
            {paymentData.paymentStatus === 'paid' ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Payment Successful</h3>
                <p className="text-gray-600 mb-4">Transaction ID: {paymentData.transactionId}</p>
                <button
                  onClick={() => navigate('/customer/orders')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  View Orders
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentData.availablePaymentMethods.map(method => (
                      <button
                        key={method}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`p-2 rounded-lg border ${selectedPaymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                      >
                        {method.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedPaymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentForm.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentForm.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full p-2 border rounded-lg ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentForm.cvv}
                          onChange={handleInputChange}
                          className={`w-full p-2 border rounded-lg ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="123"
                        />
                        {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentForm.cardName}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="John Doe"
                      />
                      {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={paymentForm.billingAddress}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.billingAddress ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123 Main St"
                      />
                      {errors.billingAddress && <p className="text-red-500 text-sm">{errors.billingAddress}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={paymentForm.city}
                          onChange={handleInputChange}
                          className={`w-full p-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="New York"
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={paymentForm.zipCode}
                          onChange={handleInputChange}
                          className={`w-full p-2 border rounded-lg ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="10001"
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === 'paypal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PayPal Email</label>
                    <input
                      type="email"
                      name="paypalEmail"
                      value={paymentForm.paypalEmail}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${errors.paypalEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="example@paypal.com"
                    />
                    {errors.paypalEmail && <p className="text-red-500 text-sm">{errors.paypalEmail}</p>}
                  </div>
                )}
                {selectedPaymentMethod === 'bank_transfer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                      <input
                        type="text"
                        name="bankAccount"
                        value={paymentForm.bankAccount}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.bankAccount ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123456789012"
                      />
                      {errors.bankAccount && <p className="text-red-500 text-sm">{errors.bankAccount}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                      <input
                        type="text"
                        name="routingNumber"
                        value={paymentForm.routingNumber}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.routingNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123456789"
                      />
                      {errors.routingNumber && <p className="text-red-500 text-sm">{errors.routingNumber}</p>}
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === 'cod' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                      <input
                        type="text"
                        name="codAddress"
                        value={paymentForm.codAddress}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.codAddress ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123 Main St"
                      />
                      {errors.codAddress && <p className="text-red-500 text-sm">{errors.codAddress}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        name="codPhone"
                        value={paymentForm.codPhone}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg ${errors.codPhone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="1234567890"
                      />
                      {errors.codPhone && <p className="text-red-500 text-sm">{errors.codPhone}</p>}
                    </div>
                  </div>
                )}
                {errors.general && (
                  <div className="flex items-center text-red-500 mt-4">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <p>{errors.general}</p>
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className={`w-full mt-6 flex items-center justify-center py-3 rounded-lg text-white font-medium ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pay Now
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        {/* Shipping Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
          <div className="flex items-start">
            <Truck className="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <p className="text-gray-700"><strong>Name:</strong> {paymentData.customerInfo.name}</p>
              <p className="text-gray-700"><strong>Address:</strong> {paymentData.shippingAddress.street}, {paymentData.shippingAddress.city}, {paymentData.shippingAddress.state} {paymentData.shippingAddress.zipCode}, {paymentData.shippingAddress.country}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {paymentData.customerInfo.phone}</p>
              <p className="text-gray-700"><strong>Email:</strong> {paymentData.customerInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPayment;