import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Added
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, RefreshCw, Receipt } from 'lucide-react';

const OrderPayment = () => {
  const { id: orderId } = useParams(); // Get orderId from URL

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
    routingNumber: ''
  });

  useEffect(() => {
    if (!orderId) return;

    const fetchPaymentData = async () => {
      setLoading(true);
      try {
        // Replace with your PHP API endpoint
        // const response = await fetch(`/api/orders/${orderId}/payment.php`);
        // const data = await response.json();

        // Mock data
        const mockPaymentData = {
          orderId: orderId,
          orderTotal: 299.99,
          tax: 29.99,
          shipping: 15.00,
          subtotal: 254.00,
          currency: 'USD',
          paymentStatus: 'pending',
          paymentMethod: null,
          transactionId: null,
          paymentDate: null,
          refundAmount: 0,
          availablePaymentMethods: ['credit_card', 'paypal', 'bank_transfer'],
          orderItems: [
            { name: 'Product 1', quantity: 2, price: 99.99 },
            { name: 'Product 2', quantity: 1, price: 54.01 }
          ]
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

  // Rest of your logic (handleInputChange, formatting, processPayment, refundPayment, icons, etc.)
  // ... [unchanged from your original code] ...

  // For brevity, only changed relevant parts here:
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
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
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentForm(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const processPayment = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPaymentData(prev => ({
        ...prev,
        paymentStatus: 'completed',
        paymentMethod: selectedPaymentMethod,
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paymentDate: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
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
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Return the same JSX as your original code with no change

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ... rest of your JSX unchanged ... */}
      {/* Just make sure to remove any usage of orderId prop, use paymentData.orderId instead */}
    </div>
  );
};

export default OrderPayment;
