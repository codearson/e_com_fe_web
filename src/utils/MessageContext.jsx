import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  // Initialize messages from localStorage or empty object
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem('userMessages');
      return savedMessages ? JSON.parse(savedMessages) : {};
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return {};
    }
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('userMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);

  const addMessage = (userId, message) => {
    setMessages(prev => ({
      ...prev,
      [userId]: prev[userId] ? [...prev[userId], message] : [message],
    }));
  };

  const getMessages = (userId) => messages[userId] || [];

  const clearMessages = (userId) => {
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[userId];
      return newMessages;
    });
  };

  const clearAllMessages = () => {
    setMessages({});
  };

  return (
    <MessageContext.Provider value={{ 
      messages, 
      addMessage, 
      getMessages, 
      clearMessages, 
      clearAllMessages 
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext); 