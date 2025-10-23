import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { processUserMessage } from '../ai/palLogic';

export default function Pal() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Load messages from localStorage or initialize with welcome message
    const savedMessages = localStorage.getItem('palMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm PAL, your AI business partner. How can I help you today?",
        sender: 'pal',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('palMessages', JSON.stringify([welcomeMessage]));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('palMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with typing indicator
    setTimeout(() => {
      const aiResponse = processUserMessage(inputMessage);
      const palMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'pal',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, palMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="chat-container" id="chat-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'pal-message'}`}
          >
            {message.text}
          </div>
        ))}
        
        {isTyping && (
          <div className="message pal-message typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </Layout>
  );
}