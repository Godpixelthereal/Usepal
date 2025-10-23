import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPlus } from 'react-icons/fi';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const palLogic = require('../ai/palLogic').default;

  // Initialize chat with greeting on first load
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      const greeting = palLogic.getTimeBasedGreeting();
      setMessages([
        { 
          id: Date.now(), 
          text: greeting, 
          sender: 'pal',
          actions: palLogic.getSuggestedActions()
        }
      ]);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { id: Date.now(), text: inputMessage, sender: 'user' }
    ];
    setMessages(newMessages);
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const response = palLogic.processMessage(inputMessage);
      setMessages([
        ...newMessages,
        { 
          id: Date.now(), 
          text: response, 
          sender: 'pal',
          actions: palLogic.getSuggestedActions()
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleActionClick = (action) => {
    let actionMessage = '';
    
    switch(action) {
      case 'add_sale':
        actionMessage = 'I want to add a new sale';
        break;
      case 'check_profit':
        actionMessage = 'Show me my profit';
        break;
      case 'view_projects':
        actionMessage = 'Show me my projects';
        break;
      case 'get_tips':
        actionMessage = 'Give me some business tips';
        break;
      default:
        actionMessage = action;
    }
    
    // Add user message
    const newMessages = [
      ...messages,
      { id: Date.now(), text: actionMessage, sender: 'user' }
    ];
    setMessages(newMessages);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const response = palLogic.processMessage(actionMessage);
      setMessages([
        ...newMessages,
        { 
          id: Date.now(), 
          text: response, 
          sender: 'pal',
          actions: palLogic.getSuggestedActions()
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>PAL</h1>
        <p>Your AI Business Partner</p>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.sender === 'pal' && (
              <div className="avatar">
                <span>P</span>
              </div>
            )}
            <div className="message-content">
              <p>{message.text}</p>
              
              {message.sender === 'pal' && message.actions && (
                <div className="action-buttons">
                  {message.actions.map((action, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleActionClick(action.action)}
                      className="action-button"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message pal">
            <div className="avatar">
              <span>P</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="send-button">
          <FiSend />
        </button>
      </form>
    </div>
  );
}