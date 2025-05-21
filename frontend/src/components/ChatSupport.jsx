import { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, X, Clock } from 'lucide-react';

export default function ChatSupport() {

  const loadMessages = () => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    return [{ 
      id: 1, 
      text: "Hi there! How can I help you today?", 
      isBot: true,
      timestamp: new Date().toISOString()
    }];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const botResponses = {
    greeting: ["Hello! Welcome to our customer support. How may I assist you today?", "Hi there! Thanks for reaching out. What brings you to our support chat today?", "Welcome! I'm your virtual assistant. What can I help you with?"],
    thanks: ["You're welcome! Is there anything else I can help you with today?", "Happy to help! Don't hesitate to reach out if you have more questions.", "It's my pleasure to assist. Is there something else you'd like to know?"],
    product: ["Our products are designed with quality in mind. Which product line are you interested in: Basic, Premium, or Enterprise?", "We offer various products across different categories. Are you looking for something specific like electronics, apparel, or home goods?", "Our most popular products include our Pro Series and Essentials collection. Would you like more information about either of these?"],
    pricing: ["Our pricing starts at $9.99/month for Basic, $19.99/month for Premium, and custom pricing for Enterprise solutions. Would you like me to explain the features of each plan?", "We have different pricing tiers available. What's your budget range, and I can suggest the most suitable option for you.", "Our current promotion offers 15% off all subscription plans when paid annually. Would you like to know more about what features are included in each tier?"],
    shipping: ["We ship worldwide with standard delivery (3-5 business days), express delivery (1-2 business days), and same-day delivery in select cities. Which option would work best for you?", "Shipping costs are calculated based on your location and chosen delivery method. Standard shipping is free for orders over $50. Would you like to know about our tracking system?", "We're currently offering free shipping on all orders until the end of the month! After delivery is confirmed, you have 30 days to return items if needed."],
    account: ["I'd be happy to help with your account. Are you having trouble with logging in, updating your profile, or managing your subscriptions?", "Account issues can be frustrating. Could you specify if it's related to password reset, payment methods, or account verification?", "For security purposes, some account changes require verification. Would you like me to walk you through the process?"],
    return: ["Our return policy allows returns within 30 days of delivery for a full refund. Would you like me to send you a return label?", "I understand you want to process a return. Was there something wrong with the product, or did it not meet your expectations?", "Returns are hassle-free with us. You can either use our online return portal or visit any of our physical stores. Which would be more convenient for you?"],
    complaint: ["I'm sorry to hear you're having issues. Could you please provide more details about the problem so I can help resolve it properly?", "Your satisfaction is our priority. I'll make sure your complaint is addressed immediately. Can you share more specifics about what happened?", "I apologize for the inconvenience. Let me connect you with our specialized team who can provide immediate assistance with this issue."],
    default: ["I'm not sure I understand fully. Could you please provide more details so I can assist you better?", "That's an interesting question. To help you more effectively, could you elaborate a bit more?", "I want to make sure I provide the right information. Could you specify what exactly you're looking for?"]
  };

  const simulateBotResponse = (text) => {
    setIsTyping(true);
    
    let responseArray = botResponses.default;
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(hello|hi|hey|howdy|greetings)\b/)) {
      responseArray = botResponses.greeting;
    } else if (lowerText.match(/\b(thank|thank you|grateful|appreciate)\b/)) {
      responseArray = botResponses.thanks;
    } else if (lowerText.match(/\b(product|item|offering|sell|buy|purchase|catalog|inventory)\b/)) {
      responseArray = botResponses.product;
    } else if (lowerText.match(/\b(price|cost|fee|how much|affordable|expensive|cheap|discount|promotion|pricing)\b/)) {
      responseArray = botResponses.pricing;
    } else if (lowerText.match(/\b(ship|delivery|arrive|shipping|deliver|send|receive|track|package)\b/)) {
      responseArray = botResponses.shipping;
    } else if (lowerText.match(/\b(account|login|password|profile|sign in|register|sign up)\b/)) {
      responseArray = botResponses.account;
    } else if (lowerText.match(/\b(return|refund|exchange|send back|money back|cancel order)\b/)) {
      responseArray = botResponses.return;
    } else if (lowerText.match(/\b(problem|issue|complaint|unhappy|dissatisfied|disappointed|broken|damaged|not working)\b/)) {
      responseArray = botResponses.complaint;
    }
    
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    
    setTimeout(() => {
      setIsTyping(false);
      const newBotMessage = {
        id: Date.now(),
        text: randomResponse,
        isBot: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const updatedMessages = [...prev, newBotMessage];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
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

      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
    
    simulateBotResponse(inputText);
    setInputText('');
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    const handleFocus = () => {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {/* Chat button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg ${isOpen ? 'bg-red-500' : 'bg-blue-500'} text-white transition-all duration-300`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 h-96 mt-4 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="mr-2" size={20} />
              <h3 className="font-medium">Customer Support</h3>
            </div>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to clear chat history?')) {
                  localStorage.removeItem('chatMessages');
                  setMessages([{ 
                    id: Date.now(), 
                    text: "Hi there! How can I help you today?", 
                    isBot: true,
                    timestamp: new Date().toISOString()
                  }]);
                }
              }}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
            >
              Clear History
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map(message => (
                              <div 
                key={message.id} 
                className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.isBot 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-blue-500 text-white'
                }`}>
                  <div className="flex items-center mb-1 justify-between">
                    <div className="flex items-center">
                      {message.isBot ? (
                        <>
                          <MessageSquare size={14} className="mr-1" />
                          <span className="text-xs font-medium">Customer Support Bot</span>
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
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center">
                    <span className="dot-typing"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for typing animation */}
      <style jsx>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #666;
          color: #666;
          box-shadow: 9984px 0 0 0 #666, 9999px 0 0 0 #666, 10014px 0 0 0 #666;
          animation: dot-typing 1.5s infinite linear;
        }

        @keyframes dot-typing {
          0% {
            box-shadow: 9984px 0 0 0 #666, 9999px 0 0 0 #666, 10014px 0 0 0 #666;
          }
          16.667% {
            box-shadow: 9984px -5px 0 0 #666, 9999px 0 0 0 #666, 10014px 0 0 0 #666;
          }
          33.333% {
            box-shadow: 9984px 0 0 0 #666, 9999px 0 0 0 #666, 10014px 0 0 0 #666;
          }
          50% {
            box-shadow: 9984px 0 0 0 #666, 9999px -5px 0 0 #666, 10014px 0 0 0 #666;
          }
          66.667% {
            box-shadow: 9984px 0 0 0 #666, 9999px 0 0 0 #666, 10014px 0 0 0 #666;
          }
          83.333% {
            box-shadow: 9984px 0 0 0 #666, 9999px 0 0 0 #666, 10014px -5px 0 0 #666;
          }
          100% {
            box-shadow: 9984px 0 0 0 #666, 9999px 0 0 0 #666, 10014px 0 0 0 #666;
          }
        }
      `}</style>
    </div>
  );
}