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

  const addNewChatContact = useCallback(
    (newContact) => {
      const exists = chatContacts.some(
        (contact) => contact._id === newContact._id
      );
      if (!exists) {
        setChatContacts((prev) => [...prev, newContact]);
      }
    },
    [chatContacts]
  );

  useEffect(() => {
    if (!socket) return;

    loadChatContacts();

    socket.on("new_contact", loadChatContacts);

    return () => socket.off("new_contact", loadChatContacts);
  }, [socket, loadChatContacts]);

  return (
    <ChatContactsContext.Provider value={{ chatContacts, addNewChatContact }}>
      {children}
    </ChatContactsContext.Provider>
  );
};
