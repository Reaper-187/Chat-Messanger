import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState([]); // Nachrichtenliste für gerade ausgewählten Chat

  const [allChats, setAllChats] = useState({
    user2: [],
    user3: [],
  });

  const sendMessageToChat = (newMessage) => {
    setAllChats((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
    }));

    setCurrentChatMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    if (selectedUserId) {
      const selectedChat = allChats[selectedUserId] || [];
      setCurrentChatMessages(selectedChat);
    }
  }, [selectedUserId, allChats]);

  return (
    <FetchChatContext.Provider
      value={{
        setAllChats,
        selectedUserId,
        setSelectedUserId,
        currentChatMessages,
        setCurrentChatMessages,
        sendMessageToChat,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
