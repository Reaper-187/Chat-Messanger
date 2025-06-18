import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "@/Hooks/useSocket";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATDATA = import.meta.env.VITE_API_CHATDATA;
const API_RESETUNREADMESSAGE = import.meta.env.VITE_API_RESETUNREADMESSAGE;
const API_ALLUNREADMESSAGE = import.meta.env.VITE_API_ALLUNREADMESSAGE;

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const socket = useSocket();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [userGotNewMessage, setUserGotNewMessage] = useState({});

  const fetchChatData = async () => {
    if (!selectedUserId) return;

    try {
      const res = await axios.get(`${API_CHATDATA}/${selectedUserId}`);
      setCurrentChatMessages(res.data.chats);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  const resetUnread = async () => {
    if (!selectedUserId || !userGotNewMessage?.[selectedUserId]) return;
    try {
      await axios.post(`${API_RESETUNREADMESSAGE}/${selectedUserId}`);
      setUserGotNewMessage((prev) => ({
        ...prev,
        [selectedUserId]: 0,
      }));
    } catch (err) {
      console.error("Error reset unread messages", err);
    }
  };

  const fetchUnread = async () => {
    try {
      const fetchUnreadData = await axios.get(API_ALLUNREADMESSAGE);
      const { messages } = fetchUnreadData.data;

      const counter = messages.reduce((acc, message) => {
        acc[message.from] = message.count;
        return acc;
      }, {});

      setUserGotNewMessage(counter);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      const isActive =
        message.from === selectedUserId || message.to === selectedUserId;

      if (isActive) {
        setCurrentChatMessages((prev) => [...prev, message]);
      }

      setUserGotNewMessage((prev) => ({
        ...prev,
        [message.from]: (prev[message.from] || 0) + 1,
      }));
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket, selectedUserId]);

  useEffect(() => {
    if (!socket || !selectedUserId) return;

    fetchChatData();
    resetUnread();

    socket.on("unread_count_reset", resetUnread);
    return () => {
      socket.off("unread_count_reset", resetUnread);
    };
  }, [socket, selectedUserId]);

  useEffect(() => {
    if (!socket) return;
    fetchUnread();
  }, [socket]);

  return (
    <FetchChatContext.Provider
      value={{
        selectedUserId,
        setSelectedUserId,
        currentChatMessages,
        setCurrentChatMessages,
        fetchChatData,
        userGotNewMessage,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
