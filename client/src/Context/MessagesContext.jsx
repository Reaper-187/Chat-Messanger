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
    try {
      if (!selectedUserId) return;
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

  const resetUnread = async () => {
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
    fetchUnread();
    socket.on("receive_message", (msg) => {
      setUserGotNewMessage((prev) => ({
        ...prev,
        [msg.from]: (prev[msg.from] || 0) + 1,
      }));
    });
    return () => {
      socket.off("receive_message", fetchUnread);
    };
  }, [socket]);

  useEffect(() => {
    // if (!socket) return;
    if (selectedUserId) {
      resetUnread();
      // socket.on("unread_count_reset", resetUnread);

      fetchChatData();
    }
    // return () => {
    //   socket.off("unread_count_reset", resetUnread);
    // };
  }, [socket, selectedUserId]);

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
