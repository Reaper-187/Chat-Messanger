import React, { createContext, useCallback, useEffect, useState } from "react";
import { useSocket } from "@/Hooks/useSocket";
import axios from "axios";
import { useAuth } from "./Auth-Context/Auth-Context";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATCONTACTS = import.meta.env.VITE_API_CHATCONTACTS;
const API_SORTCONTACT = import.meta.env.VITE_API_SORTCONTACTS;

export const ChatContactsContext = createContext();

export const ChatContactsDataProvider = ({ children }) => {
  const socket = useSocket();
  const { isAuthStatus } = useAuth();
  const [chatContacts, setChatContacts] = useState([]);
  const [latestSortedChats, setLatestSortedChats] = useState([]);

  const loadChatContacts = useCallback(async () => {
    if (!isAuthStatus?.loggedIn) return;
    console.log("loadChatContacts aufgerufen");
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

  const fetchSortContacts = useCallback(async () => {
    try {
      const res = await axios.get(API_SORTCONTACT);
      setLatestSortedChats(res.data.latestMsgOfContact);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  }, []);

  useEffect(() => {
    if (!chatContacts) return;
    fetchSortContacts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    loadChatContacts();

    socket.on("new_contact", loadChatContacts);

    return () => socket.off("new_contact", loadChatContacts);
  }, [socket, loadChatContacts, isAuthStatus?.loggedIn]);

  return (
    <ChatContactsContext.Provider
      value={{
        chatContacts,
        addNewChatContact,
        latestSortedChats,
        fetchSortContacts,
      }}
    >
      {children}
    </ChatContactsContext.Provider>
  );
};
