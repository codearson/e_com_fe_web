import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  // messages: { [userId]: [array of messages] }
  const [messages, setMessages] = useState({});

  const addMessage = (userId, message) => {
    setMessages(prev => ({
      ...prev,
      [userId]: prev[userId] ? [...prev[userId], message] : [message],
    }));
  };

  const getMessages = (userId) => messages[userId] || [];

  return (
    <MessageContext.Provider value={{ messages, addMessage, getMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext); 