import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiSend, FiUser, FiCpu } from 'react-icons/fi';
import { chatMessages, getBusinessData } from '../data/mockData';

export default function Assistant() {
  const router = useRouter();
  const [businessData, setBusinessData] = useState(null);
  const [messages, setMessages] = useState(chatMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if business data exists in localStorage
    const data = getBusinessData();
    if (!data) {
      // Redirect to onboarding if no business data
      router.push('/');
      return;
    }
    setBusinessData(data);
  }, [router]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "Based on your business data, I recommend focusing on increasing your marketing efforts in the digital space.",
        "I've analyzed your recent sales trends and noticed a 15% increase in the technology sector. Would you like me to prepare a detailed report?",
        "Your current profit margin is 42.8%, which is above industry average. Great job managing your expenses!",
        "I've identified a potential opportunity to reduce costs in your supply chain. Would you like me to elaborate?",
        "Looking at your project deadlines, I notice you have 3 projects due within the next 30 days. Would you like help prioritizing your resources?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: messages.length + 2,
        sender: 'system',
        content: randomResponse,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 1000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!businessData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>AI Assistant | PAL - AI Business Partner</title>
      </Head>

      <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Assistant</h1>
            <p className="text-gray-600">Chat with PAL, your AI Business Partner</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === 'system' ? (
                        <FiCpu className="mr-2 text-gray-600" />
                      ) : (
                        <FiUser className="mr-2 text-white" />
                      )}
                      <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.sender === 'system' ? 'PAL' : 'You'} • {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="Ask PAL anything about your business..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!newMessage.trim()}
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}