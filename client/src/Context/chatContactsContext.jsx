import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const API_CHATCONTACTS = import.meta.env.VITE_API_CHATCONTACTS;

export const FetchChatContactsData = createContext();

export const ChatContactsDataProvider = ({ children }) => {
  const [chatContactData, setChatContactData] = useState([]);

  const fetchChatContactData = async () => {
    try {
      const fetchData = await axios.get(API_CHATCONTACTS);
      console.log("fetchData", fetchData.data.chatContacts);

      setChatContactData(fetchData.data.chatContacts);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  console.log(chatContactData);

  useEffect(() => {
    fetchChatContactData();
  }, []);

  return (
    <FetchChatContactsData.Provider value={{ chatContactData }}>
      {children}
    </FetchChatContactsData.Provider>
  );
};
