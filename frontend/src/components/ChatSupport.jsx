import { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, X, Clock, Star, Gift, ShoppingCart, TrendingUp, Award, Phone, Mail } from 'lucide-react';
import axios from 'axios';

export default function SmartChatSupport() {
  
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

  const fetchCustomerData = async () => {
    try {
      const storedCustomerData = localStorage.getItem('customerData');
      const customerName = localStorage.getItem('customerName');
      const customerId = localStorage.getItem('customerId');
      const customerCode = localStorage.getItem('customerCode');

      if (!storedCustomerData && !customerName) {
        throw new Error('No customer data found. Please log in again.');
      }

      let parsedCustomerData = null;
      if (storedCustomerData) {
        parsedCustomerData = JSON.parse(storedCustomerData);
      }

      const customer = {
        id: customerId || parsedCustomerData?.id || 'Unknown',
        name: customerName || parsedCustomerData?.name || 'Valued Customer',
        email: parsedCustomerData?.email || 'Not available',
        customer_code: customerCode || parsedCustomerData?.customer_code || 'N/A',
        // Default values for fields that might not be available
        loyaltyPoints: parsedCustomerData?.loyalty_points || 0,
        membershipTier: parsedCustomerData?.membership_tier || 'Standard',
        totalPurchases: parsedCustomerData?.total_purchases || 0,
        totalSpent: parsedCustomerData?.total_spent || 0,
        lastPurchase: parsedCustomerData?.last_purchase || new Date().toISOString().split('T')[0],
        preferredCategories: parsedCustomerData?.preferred_categories || ['General'],
        purchaseHistory: parsedCustomerData?.purchase_history || [],
        openTickets: parsedCustomerData?.open_tickets || [],
        chatHistory: parsedCustomerData?.chat_history || []
      };

      if (customerId) {
        try {
          const response = await axios.get(`${apiUrl}getCustomer&id=${customerId}`);
          if (response.data.type === 'success' && response.data.customer) {
            const apiCustomer = response.data.customer;
            // Merge API data with existing data
            customer.email = apiCustomer.email || customer.email;
            customer.phone = apiCustomer.phone || customer.phone;
            // Add any other fields from API response
            if (apiCustomer.loyalty_points) customer.loyaltyPoints = apiCustomer.loyalty_points;
            if (apiCustomer.membership_tier) customer.membershipTier = apiCustomer.membership_tier;
          }
        } catch (apiError) {
          console.warn('Could not fetch additional customer data:', apiError);
        }
      }

      setCustomerData(customer);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load messages with real customer data
  const loadMessages = (customer) => {
    const savedMessages = localStorage.getItem('smartChatMessages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    return [{ 
      id: 1, 
      text: `Hello ${customer?.name || 'there'}! Welcome back to our support. ${customer?.membershipTier ? `I can see you're a ${customer.membershipTier} member` : 'Thank you for being our valued customer'}${customer?.loyaltyPoints ? ` with ${customer.loyaltyPoints} loyalty points` : ''}. How can I assist you today?`, 
      isBot: true,
      timestamp: new Date().toISOString(),
      type: 'greeting'
    }];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (customerData) {
      setMessages(loadMessages(customerData));
    }
  }, [customerData]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const smartResponses = {
    greeting: [
      `Hello ${customerData?.name || 'there'}! Great to see you again. ${customerData?.membershipTier ? `As a ${customerData.membershipTier} member, ` : ''}${customerData?.loyaltyPoints ? `you have ${customerData.loyaltyPoints} points available. ` : ''}What can I help you with today?`,
      `Welcome back, ${customerData?.name || 'valued customer'}! ${customerData?.lastPurchase ? `I notice your last recorded activity was ${new Date(customerData.lastPurchase).toLocaleDateString()}. ` : ''}How can I assist you today?`,
      `Hi ${customerData?.name || 'there'}! ${customerData?.membershipTier ? `You're one of our valued ${customerData.membershipTier} members. ` : ''}What brings you to support today?`
    ],

    account: [
      `I can help you with your account, ${customerData?.name || 'valued customer'}. ${customerData?.loyaltyPoints ? `You currently have ${customerData.loyaltyPoints} loyalty points ` : ''}${customerData?.totalPurchases ? `and have made ${customerData.totalPurchases} purchases` : ''}${customerData?.totalSpent ? ` totaling $${customerData.totalSpent}` : ''}. What would you like to know?`,
      `Your account shows ${customerData?.membershipTier ? `you're a ${customerData.membershipTier} member` : 'you\'re a valued customer'}${customerData?.totalPurchases ? ` with ${customerData.totalPurchases} purchases` : ''}. Are you having login issues, or do you need help with something else?`,
      `Looking at your account, everything seems to be in good standing. ${customerData?.loyaltyPoints ? `You have ${customerData.loyaltyPoints} points available for rewards. ` : ''}What account assistance do you need?`
    ],

    loyalty: [
      `Excellent question about loyalty points! ${customerData?.loyaltyPoints ? `You currently have ${customerData.loyaltyPoints} points. You can redeem 1000 points for $10 off, 2000 points for $25 off, or save up for our premium rewards.` : 'You can earn points on every purchase and redeem them for discounts.'} Would you like to see available rewards?`,
      `${customerData?.loyaltyPoints ? `Your ${customerData.loyaltyPoints} loyalty points can be used for discounts or exclusive products.` : 'You can earn loyalty points on every purchase.'} ${customerData?.membershipTier ? `As a ${customerData.membershipTier} member, you also get bonus point multipliers on certain categories.` : ''} Want to learn more?`,
      `${customerData?.loyaltyPoints ? `With ${customerData.loyaltyPoints} points, you're doing great!` : 'You can start earning points today!'} You earn points on every purchase${customerData?.membershipTier ? `, and ${customerData.membershipTier} members like you get 1.5x points on preferred categories` : ''}. Need help redeeming points?`
    ],

    recommendations: [
      `Based on your preferences${customerData?.preferredCategories?.length ? ` in ${customerData.preferredCategories.join(', ')}` : ''}, I'd love to show you some personalized recommendations. ${customerData?.membershipTier ? `Plus, you'd earn bonus points as a ${customerData.membershipTier} member.` : ''} Should I show you some trending products?`,
      `Looking at your account, I think you'd love our premium collections. ${customerData?.membershipTier ? `Plus, you'd earn bonus points as a ${customerData.membershipTier} member.` : ''} Want to see what's trending?`,
      `I can suggest products that customers with similar preferences love. ${customerData?.loyaltyPoints ? `You can also use your ${customerData.loyaltyPoints} points for additional savings.` : ''} Shall I pull up some personalized recommendations?`
    ],

    orders: [
      `I can help you with your order information. ${customerData?.purchaseHistory?.length ? `I can see you have purchase history with us.` : 'Let me help you check on any orders.'} Are you asking about a specific order or need tracking information?`,
      `Let me help you with your orders. ${customerData?.totalPurchases ? `You've been quite active with us with ${customerData.totalPurchases} purchases!` : ''} What order information do you need?`,
      `I'm here to help with any order questions. ${customerData?.lastPurchase ? `Your last recorded purchase was on ${new Date(customerData.lastPurchase).toLocaleDateString()}.` : ''} Which specific order would you like me to look into?`
    ],

    shipping: [
      `For shipping information, ${customerData?.membershipTier ? `your ${customerData.membershipTier} status qualifies you for priority processing and ` : ''}you can get free expedited shipping on orders over $50. Standard delivery is 2-3 days, expedited is next day. Need tracking for a current order?`,
      `${customerData?.membershipTier ? `As a ${customerData.membershipTier} member, you get priority shipping processing.` : ''} We also offer same-day delivery in select areas. Are you checking on a current shipment or planning a new order?`,
      `Your shipping options include standard and expedited delivery. ${customerData?.membershipTier ? `With your membership tier, you get free shipping on most orders.` : ''} What shipping question can I help with?`
    ],

    returns: [
      `I understand you want to return something. ${customerData?.purchaseHistory?.length ? `Looking at your purchase history, ` : ''}I can help you start the return process immediately. Which item needs to be returned?`,
      `Returns are easy${customerData?.membershipTier ? ` for ${customerData.membershipTier} members - you get extended return windows and free return shipping` : ''}. Which of your recent purchases needs to be returned?`,
      `No problem with returns! ${customerData?.purchaseHistory?.length ? 'Looking at your purchase history, ' : ''}Once you tell me which item, I can generate a return label and process the refund to your original payment method.`
    ],

    complaint: [
      `I'm very sorry to hear about this issue, ${customerData?.name || 'valued customer'}. ${customerData?.membershipTier ? `As a ${customerData.membershipTier} member, ` : ''}Your satisfaction is our top priority. Let me escalate this immediately and see what we can do to make this right${customerData?.loyaltyPoints ? ', including potential loyalty point compensation' : ''}.`,
      `This is definitely not the experience we want for valued customers like you. ${customerData?.totalPurchases ? `Given your ${customerData.totalPurchases} successful orders with us, this seems unusual.` : ''} Let me personally ensure this gets resolved quickly. Can you provide more details?`,
      `I sincerely apologize, ${customerData?.name || 'valued customer'}. ${customerData?.membershipTier ? `Your loyalty as a ${customerData.membershipTier} member means everything to us.` : 'Your loyalty means everything to us.'} I'm going to flag this for immediate review and will make sure you're compensated appropriately. What specifically went wrong?`
    ],

    pricing: [
      `Great question about pricing! ${customerData?.membershipTier ? `As a ${customerData.membershipTier} member, you get exclusive discounts on many items.` : ''} ${customerData?.preferredCategories?.length ? `Based on your interest in ${customerData.preferredCategories.join(' and ')}, I can show you current promotions in those categories.` : ''} What specific product pricing are you curious about?`,
      `Pricing varies by category${customerData?.membershipTier ? ', but you always get member discounts' : ''}! ${customerData?.loyaltyPoints ? `Your ${customerData.loyaltyPoints} points can also be applied for additional savings.` : ''} Are you looking at something specific, or would you like to see our current promotions?`,
      `${customerData?.membershipTier ? `With your ${customerData.membershipTier} status, you get early access to sales and special member pricing.` : ''} ${customerData?.loyaltyPoints ? 'Plus, you earn points on every purchase.' : ''} What product pricing can I help you with?`
    ],

    default: [
      `I want to make sure I help you properly, ${customerData?.name || 'valued customer'}. Could you provide a bit more detail about what you're looking for? I have access to your account information and can provide personalized assistance.`,
      `As your support assistant, I'm here to help with anything from orders and returns to recommendations and account questions. What specific area can I assist you with today?`,
      `I'd love to help you find exactly what you need. ${customerData?.purchaseHistory?.length ? 'With your purchase history and preferences, ' : ''}I can provide very targeted assistance. Could you be a bit more specific about your question?`
    ]
  };

  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(loyalty|points|reward|redeem|earn|member|gold|silver|bronze|tier)\b/)) {
      return 'loyalty';
    }
    
    if (lowerText.match(/\b(recommend|suggest|new|popular|trending|like|similar|what should)\b/)) {
      return 'recommendations';
    }
    
    if (lowerText.match(/\b(account|profile|login|password|email|update)\b/)) {
      return 'account';
    }

    if (lowerText.match(/\b(order|purchase|buy|bought|history|track|tracking)\b/)) {
      return 'orders';
    }

    if (lowerText.match(/\b(ship|delivery|arrive|when|deliver|send|receive|track|package)\b/)) {
      return 'shipping';
    }

    if (lowerText.match(/\b(return|refund|exchange|send back|money back|cancel)\b/)) {
      return 'returns';
    }

    if (lowerText.match(/\b(problem|issue|complaint|unhappy|wrong|broken|damaged|terrible|awful|disappointed)\b/)) {
      return 'complaint';
    }

    if (lowerText.match(/\b(price|cost|how much|expensive|cheap|discount|sale|promotion)\b/)) {
      return 'pricing';
    }

    if (lowerText.match(/\b(hello|hi|hey|help|support)\b/)) {
      return 'greeting';
    }

    return 'default';
  };

  const generateRecommendations = () => {
    const baseRecommendations = [
      {
        id: 1,
        name: "Premium Wireless Earbuds",
        category: "Electronics",
        price: 149.99,
        originalPrice: 199.99,
        discount: "25% OFF",
        reason: "Popular in Electronics",
        loyaltyPoints: 150
      },
      {
        id: 2,
        name: "Smart Home Hub",
        category: "Electronics", 
        price: 89.99,
        originalPrice: 119.99,
        discount: customerData?.membershipTier ? `${customerData.membershipTier} Member Price` : "Special Price",
        reason: customerData?.membershipTier ? `Trending for ${customerData.membershipTier} members` : "Trending product",
        loyaltyPoints: 90
      },
      {
        id: 3,
        name: "Organic Coffee Beans Set",
        category: "Home & Garden",
        price: 24.99,
        originalPrice: 34.99,
        discount: "Bundle Deal",
        reason: "Great for home brewing",
        loyaltyPoints: 25
      }
    ];

    if (customerData?.preferredCategories?.length) {
      baseRecommendations.forEach(rec => {
        if (customerData.preferredCategories.includes(rec.category)) {
          rec.reason = `Perfect match for your ${rec.category} preferences`;
        }
      });
    }

    return baseRecommendations;
  };

  const simulateBotResponse = (text) => {
    setIsTyping(true);
    
    const intent = detectIntent(text);
    const responseArray = smartResponses[intent] || smartResponses.default;
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    
    setTimeout(() => {
      setIsTyping(false);
      const newBotMessage = {
        id: Date.now(),
        text: randomResponse,
        isBot: true,
        timestamp: new Date().toISOString(),
        type: intent
      };

      setMessages(prev => {
        const updatedMessages = [...prev, newBotMessage];
        localStorage.setItem('smartChatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      if (intent === 'recommendations' || intent === 'default') {
        setTimeout(() => {
          setShowRecommendations(true);
        }, 500);
      }
      
    }, 1000 + Math.random() * 1000); 
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      localStorage.setItem('smartChatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
    
    simulateBotResponse(inputText);
    setInputText('');
    setShowRecommendations(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleRecommendationClick = (recommendation) => {
    const message = `I'm interested in the ${recommendation.name} you recommended. Can you tell me more about it?`;
    setInputText(message);
    setShowRecommendations(false);
  };

  const handleQuickAction = (action) => {
    const quickActions = {
      'check-points': `How many loyalty points do I have and what can I redeem them for?`,
      'track-order': `I'd like to track my recent order status.`,
      'recommendations': `Can you show me some product recommendations based on my purchase history?`,
      'account-help': `I need help with my account settings and profile.`
    };
    
    setInputText(quickActions[action]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
        <button className="relative flex items-center justify-center p-4 rounded-full shadow-lg bg-gray-400 text-white">
          <MessageSquare size={24} />
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
        <button className="relative flex items-center justify-center p-4 rounded-full shadow-lg bg-red-500 text-white">
          <X size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {/* Chat button with notification indicator */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center p-4 rounded-full shadow-lg ${isOpen ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white transition-all duration-300 hover:scale-105`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            !
          </div>
        )}
      </button>
      
      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="bg-transparent rounded-xl shadow-2xl w-80 sm:w-96 h-[500px] mt-4 flex flex-col overflow-hidden border border-gray-200">
          {/* Enhanced Header with Customer Info */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={20} />
                <h3 className="font-medium">Smart Support</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={16} />
                <span className="text-xs">{customerData?.membershipTier || 'Customer'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs opacity-90">
              <span>💎 {customerData?.loyaltyPoints || 0} points</span>
              <span>📦 {customerData?.totalPurchases || 0} orders</span>
              <button 
                onClick={() => {
                  if (confirm('Clear chat history?')) {
                    localStorage.removeItem('smartChatMessages');
                    setMessages([{ 
                      id: Date.now(), 
                      text: `Hello ${customerData?.name || 'there'}! How can I assist you today?`, 
                      isBot: true,
                      timestamp: new Date().toISOString()
                    }]);
                  }
                }}
                className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 p-2 border-b">
            <div className="flex space-x-1 overflow-x-auto">
              <button 
                onClick={() => handleQuickAction('check-points')}
                className="flex items-center px-3 py-1 bg-white rounded-full text-xs hover:bg-blue-50 whitespace-nowrap"
              >
                <Gift size={12} className="mr-1" />
                Points
              </button>
              <button 
                onClick={() => handleQuickAction('track-order')}
                className="flex items-center px-3 py-1 bg-white rounded-full text-xs hover:bg-blue-50 whitespace-nowrap"
              >
                <ShoppingCart size={12} className="mr-1" />
                Track Order
              </button>
              <button 
                onClick={() => handleQuickAction('recommendations')}
                className="flex items-center px-3 py-1 bg-white rounded-full text-xs hover:bg-blue-50 whitespace-nowrap"
              >
                <TrendingUp size={12} className="mr-1" />
                Recommend
              </button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-xs px-4 py-3 rounded-lg shadow-sm ${
                  message.isBot 
                    ? 'bg-white text-gray-800 border border-gray-200' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                }`}>
                  <div className="flex items-center mb-1 justify-between">
                    <div className="flex items-center">
                      {message.isBot ? (
                        <>
                          <MessageSquare size={14} className="mr-1 text-blue-500" />
                          <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                        </>
                      ) : (
                        <>
                          <User size={14} className="mr-1" />
                          <span className="text-xs font-medium">You</span>
                        </>
                      )}
                    </div>
                    {message.timestamp && (
                      <div className="flex items-center ml-2 text-xs opacity-70">
                        <Clock size={10} className="mr-1" />
                        {formatTimestamp(message.timestamp)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {/* Smart Recommendations */}
            {showRecommendations && (
              <div className="mb-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                    <Star size={16} className="mr-2 text-yellow-500" />
                    Personalized Recommendations
                  </h4>
                  <div className="space-y-2">
                    {generateRecommendations().map(rec => (
                      <div 
                        key={rec.id}
                        onClick={() => handleRecommendationClick(rec)}
                        className="bg-white p-3 rounded-lg border hover:border-blue-300 cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="text-sm font-medium text-gray-800">{rec.name}</h5>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {rec.discount}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{rec.reason}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-blue-600">${rec.price}</span>
                            <span className="text-xs text-gray-500 line-through">${rec.originalPrice}</span>
                          </div>
                          <span className="text-xs text-purple-600">+{rec.loyaltyPoints} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <div className="dot-typing"></div>
                    <span className="ml-2 text-xs text-gray-500">AI Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Enhanced Input area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about orders, get recommendations, check points..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Powered by AI • Context-aware</span>
              <div className="flex items-center space-x-3">
                <Phone size={12} />
                <Mail size={12} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced CSS */}
      <style jsx>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 4px;
          height: 4px;
          border-radius: 5px;
          background-color: #3b82f6;
          color: #3b82f6;
          box-shadow: 9984px 0 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          animation: dot-typing 1.5s infinite linear;
        }

        @keyframes dot-typing {
          0% {
            box-shadow: 9984px 0 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          }
          16.667% {
            box-shadow: 9984px -5px 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          }
          33.333% {
            box-shadow: 9984px 0 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          }
          50% {
            box-shadow: 9984px 0 0 0 #3b82f6, 9999px -5px 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          }
          66.667% {
            box-shadow: 9984px 0 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          }
          83.333% {
            box-shadow: 9984px 0 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px -5px 0 0 #3b82f6;
          }
          100% {
            box-shadow: 9984px 0 0 0 #3b82f6, 9999px 0 0 0 #3b82f6, 10014px 0 0 0 #3b82f6;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}