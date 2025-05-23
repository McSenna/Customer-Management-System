import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';

const OrderStatus = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        // Mock data (replace with real API response)
        const mockOrderData = {
          orderId: orderId || 'ORD-001',
          customerInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567'
          },
          orderDate: '2024-01-15T10:30:00Z',
          status: 'shipped',
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-20',
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          orderItems: [
            {
              id: 1,
              name: 'Wireless Headphones',
              quantity: 1,
              price: 199.99,
              image: '/api/placeholder/80/80'
            },
            {
              id: 2,
              name: 'Phone Case',
              quantity: 2,
              price: 25.00,
              image: '/api/placeholder/80/80'
            }
          ],
          orderTotal: 249.99,
          statusHistory: [
            {
              status: 'pending',
              timestamp: '2024-01-15T10:30:00Z',
              note: 'Order placed and awaiting processing'
            },
            {
              status: 'processing',
              timestamp: '2024-01-15T14:20:00Z',
              note: 'Order is being prepared for shipment'
            },
            {
              status: 'shipped',
              timestamp: '2024-01-16T09:15:00Z',
              note: 'Order has been shipped via UPS'
            }
          ],
          shippingCarrier: 'UPS',
          shippingMethod: 'Ground'
        };

        setTimeout(() => {
          setOrderData(mockOrderData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const statusSteps = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getStatusIndex = (status) => statusSteps.findIndex(step => step.key === status);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'processing': 'text-blue-600 bg-blue-100',
      'shipped': 'text-purple-600 bg-purple-100',
      'delivered': 'text-green-600 bg-green-100',
      'cancelled': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading || !orderData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(orderData.status);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/customer/orders')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Status</h1>
            <p className="text-gray-600">Track your order progress</p>
          </div>
        </div>
      </div>

      {/* Order Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="space-y-2">
              <div><span className="font-medium">Order ID:</span> {orderData.orderId}</div>
              <div><span className="font-medium">Order Date:</span> {new Date(orderData.orderDate).toLocaleDateString()}</div>
              <div><span className="font-medium">Total:</span> ${orderData.orderTotal.toFixed(2)}</div>
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(orderData.status)}`}>
                  {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                </span>
              </div>
              {orderData.trackingNumber && (
                <div>
                  <span className="font-medium">Tracking:</span>
                  <span className="ml-2 font-mono text-sm">{orderData.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                {orderData.customerInfo.name}
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {orderData.customerInfo.email}
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {orderData.customerInfo.phone}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Order Progress</h3>
        <div className="flex items-center justify-between relative">
          {statusSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className={`mt-2 text-sm font-medium ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                    index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`} style={{ transform: 'translateX(50%)', zIndex: -1 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Shipping Address
        </h3>
        <div className="text-gray-700">
          <div>{orderData.shippingAddress.street}</div>
          <div>
            {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
          </div>
          <div>{orderData.shippingAddress.country}</div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-4">
          {orderData.orderItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Status History
        </h3>
        <div className="space-y-4">
          {orderData.statusHistory.slice(0).reverse().map((history, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(history.status).replace('text-', 'bg-').replace('bg-', 'bg-')}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{history.status}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(history.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{history.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
