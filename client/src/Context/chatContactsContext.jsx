import React, { createContext, useCallback, useEffect, useState } from "react";
import { useSocket } from "@/Hooks/useSocket";

import axios from "axios";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATCONTACTS = import.meta.env.VITE_API_CHATCONTACTS;

export const ChatContactsContext = createContext();

export const ChatContactsDataProvider = ({ children }) => {
  const socket = useSocket();

  const [chatContacts, setChatContacts] = useState([]);

  const loadChatContacts = useCallback(async () => {
    try {
      const fetchData = await axios.get(API_CHATCONTACTS);
      setChatContacts(fetchData.data.chatContacts);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewContact = () => {
      loadChatContacts();
    };

    socket.on("new_contact", handleNewContact);

    return () => {
      socket.off("new_contact", handleNewContact);
    };
  }, [socket, loadChatContacts]);

  const addNewChatContact = (newContact) => {
    setChatContacts((prev) => [...prev, newContact]);
  };

  useEffect(() => {
    loadChatContacts();
  }, [loadChatContacts]);

  return (
    <ChatContactsContext.Provider
      value={{ chatContacts, addNewChatContact, loadChatContacts }}
    >
      {children}
    </ChatContactsContext.Provider>
  );
};
