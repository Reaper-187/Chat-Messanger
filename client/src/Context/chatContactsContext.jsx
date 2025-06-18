import React, { createContext, useCallback, useEffect, useState } from "react";
import { useSocket } from "@/Hooks/useSocket";
import axios from "axios";
import { useAuth } from "./Auth-Context/Auth-Context";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATCONTACTS = import.meta.env.VITE_API_CHATCONTACTS;

export const ChatContactsContext = createContext();

export const ChatContactsDataProvider = ({ children }) => {
  const socket = useSocket();
  const [chatContacts, setChatContacts] = useState([]);
  const { isAuthStatus } = useAuth();

  const loadChatContacts = useCallback(async () => {
    if (!isAuthStatus?.loggedIn) return;

    try {
      const fetchData = await axios.get(API_CHATCONTACTS);
      setChatContacts(fetchData.data.chatContacts);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  }, [isAuthStatus]);

  console.log("chatContacts", chatContacts);

  useEffect(() => {
    if (!socket || !isAuthStatus?.loggedIn) return;

    const handleNewContact = () => loadChatContacts();
    socket.on("new_contact", handleNewContact);

    return () => socket.off("new_contact", handleNewContact);
  }, [socket, loadChatContacts, isAuthStatus]);

  useEffect(() => {
    if (isAuthStatus?.loggedIn) {
      loadChatContacts();
    }
  }, [isAuthStatus?.loggedIn, loadChatContacts]);

  const addNewChatContact = (newContact) => {
    setChatContacts((prev) => [...prev, newContact]);
  };

  useEffect(() => {
    loadChatContacts();
  }, [loadChatContacts]);

  return (
    <ChatContactsContext.Provider value={{ chatContacts, addNewChatContact }}>
      {children}
    </ChatContactsContext.Provider>
  );
};
