import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "@/Hooks/useSocket";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATDATA = import.meta.env.VITE_API_CHATDATA;

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const socket = useSocket();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [currentChatMessages, setCurrentChatMessages] = useState([]);

  const fetchChatData = async () => {
    try {
      const fetchData = await axios.get(`${API_CHATDATA}/${selectedUserId}`);
      setCurrentChatMessages(fetchData.data.chats);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (newMessage) => {
      if (
        newMessage.from === selectedUserId ||
        newMessage.to === selectedUserId
      ) {
        setCurrentChatMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchChatData();
    }
  }, [selectedUserId]);

  return (
    <FetchChatContext.Provider
      value={{
        selectedUserId,
        setSelectedUserId,
        currentChatMessages,
        setCurrentChatMessages,
        fetchChatData,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
