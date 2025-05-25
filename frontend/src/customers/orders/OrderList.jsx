import React, { useState, createContext, useContext } from 'react';
import { CreditCard, Package, Clock, CheckCircle, XCircle, Eye, DollarSign } from 'lucide-react';

// Order Context for state management
const OrderContext = createContext();

// Mock data
const initialOrders = [
  {
    id: 'ORD-001',
    items: [
      { name: 'Wireless Headphones', price: 99.99, quantity: 1 },
      { name: 'Phone Case', price: 19.99, quantity: 2 }
    ],
    total: 139.97,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date('2024-01-15'),
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-002',
    items: [
      { name: 'Laptop Stand', price: 79.99, quantity: 1 },
      { name: 'USB Cable', price: 12.99, quantity: 3 }
    ],
    total: 118.96,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-14'),
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
  },
  {
    id: 'ORD-003',
    items: [
      { name: 'Bluetooth Speaker', price: 149.99, quantity: 1 }
    ],
    total: 149.99,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-13'),
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  }
];

// OrderList Component
const OrderList = () => {
  const { orders, setSelectedOrder, setCurrentView } = useContext(OrderContext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-green-600 bg-green-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'text-green-600' : 'text-red-600';
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setCurrentView('status');
  };

  const handlePayOrder = (order) => {
    setSelectedOrder(order);
    setCurrentView('payment');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-gray-700">
                        {item.name} {item.quantity > 1 && `(${item.quantity})`}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-gray-500 text-xs">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {order.createdAt.toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {order.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePayOrder(order)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Process Payment"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// OrderPayment Component
const OrderPayment = () => {
  const { selectedOrder, updateOrder, setCurrentView } = useContext(OrderContext);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!selectedOrder) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No order selected for payment</p>
      </div>
    );
  }

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      updateOrder(selectedOrder.id, {
        paymentStatus: 'paid',
        status: selectedOrder.status === 'pending' ? 'processing' : selectedOrder.status
      });
      setProcessing(false);
      setCurrentView('status');
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Payment Processing</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{selectedOrder.id}</span>
            </div>
            <div className="border-t pt-2 mt-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-3 flex justify-between font-bold">
              <span>Total:</span>
              <span>${selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {paymentMethod.includes('card') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Back to Orders
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// OrderStatus Component
const OrderStatus = () => {
  const { selectedOrder, updateOrder, setCurrentView } = useContext(OrderContext);

  if (!selectedOrder) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No order selected to view status</p>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: CheckCircle },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === selectedOrder.status);
  };

  const handleStatusUpdate = (newStatus) => {
    updateOrder(selectedOrder.id, { status: newStatus });
  };

  const getStatusIcon = (step, index) => {
    const currentIndex = getCurrentStepIndex();
    const IconComponent = step.icon;
    
    if (index <= currentIndex) {
      return <IconComponent className="h-5 w-5 text-green-600" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Order Status</h2>
        </div>
        <button
          onClick={() => setCurrentView('list')}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">{selectedOrder.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
            <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
            <div className="space-y-2">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Order Progress</h3>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const currentIndex = getCurrentStepIndex();
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={step.key} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getStatusIcon(step, index)}
                  </div>
                  <div className="flex-grow">
                    <div className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                    {isCurrent && (
                      <div className="text-sm text-blue-600 font-medium">Current Status</div>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-px h-8 ml-2 ${isActive ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Update Actions - This would typically be for admin use */}
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-gray-800">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusSteps.map((step) => (
                <button
                  key={step.key}
                  onClick={() => handleStatusUpdate(step.key)}
                  disabled={selectedOrder.status === step.key}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.status === step.key
                      ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const OrderManagementApp = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentView, setCurrentView] = useState('list');

  const updateOrder = (orderId, updates) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, ...updates }));
    }
  };

  const contextValue = {
    orders,
    selectedOrder,
    setSelectedOrder,
    updateOrder,
    currentView,
    setCurrentView
  };

  return (
    <OrderContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => setCurrentView('payment')}
                disabled={!selectedOrder}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'payment'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                Payment
              </button>
              <button
                onClick={() => setCurrentView('status')}
                disabled={!selectedOrder}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'status'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                Order Status
              </button>
            </nav>
          </div>

          {currentView === 'list' && <OrderList />}
          {currentView === 'payment' && <OrderPayment />}
          {currentView === 'status' && <OrderStatus />}
        </div>
      </div>
    </OrderContext.Provider>
  );
};

export default OrderManagementApp;