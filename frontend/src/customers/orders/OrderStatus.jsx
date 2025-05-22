import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Edit3,
  Save,
  X
} from 'lucide-react';

const OrderStatus = () => {
  const { id: orderId } = useParams();  // Get orderId from URL param "id"

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        // Replace this with your actual API call
        // const response = await fetch(`/api/orders/${orderId}/status.php`);
        // const data = await response.json();

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
          setNewStatus(mockOrderData.status);
          setTrackingNumber(mockOrderData.trackingNumber || '');
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

  const updateOrderStatus = async () => {
    setUpdating(true);
    try {
      // Replace with your API call to update status
      // await fetch(`/api/orders/${orderId}/update-status.php`, { ... })

      await new Promise(resolve => setTimeout(resolve, 1500)); // mock delay

      setOrderData(prev => ({
        ...prev,
        status: newStatus,
        trackingNumber: trackingNumber,
        statusHistory: [
          ...prev.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: `Status updated to ${newStatus}`
          }
        ]
      }));

      setEditingStatus(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setNewStatus(orderData.status);
    setTrackingNumber(orderData.trackingNumber || '');
    setEditingStatus(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(orderData?.status);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ... rest of your component JSX unchanged ... */}
      {/* Just remove `orderId` prop usage and everything else remains same */}
      {/* The full JSX from your original component goes here */}
    </div>
  );
};

export default OrderStatus;
