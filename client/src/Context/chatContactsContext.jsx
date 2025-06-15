import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATCONTACTS = import.meta.env.VITE_API_CHATCONTACTS;

export const ChatContactsContext = createContext();

export const ChatContactsDataProvider = ({ children }) => {
  const [chatContacts, setChatContacts] = useState([]);

  const loadChatContacts = async () => {
    try {
      const fetchData = await axios.get(API_CHATCONTACTS);
      setChatContacts(fetchData.data.chatContacts);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  const addNewChatContact = (newContact) => {
    setChatContacts((prev) => [...prev, newContact]);
  };

  useEffect(() => {
    addNewChatContact();
    loadChatContacts();
  }, []);

  return (
    <ChatContactsContext.Provider value={{ chatContacts, addNewChatContact }}>
      {children}
    </ChatContactsContext.Provider>
  );
};
