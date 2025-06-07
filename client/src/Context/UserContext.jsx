import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const FetchUserContext = createContext();
const fetchContacts = import.meta.env.VITE_API_CONTACTS;

export const UserDataFlowProvider = ({ children }) => {
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    try {
      const mockContacts = async () => {
        const contactData = await axios.get(fetchContacts);
        const allContacts = contactData.data.contacts;
        console.log("All Contats", allContacts);

        setContacts(allContacts);
      };
      mockContacts();
    } catch (err) {
      console.error(err);
    }
  }, []);

  console.log(contacts);

  return (
    <FetchUserContext.Provider value={{ contacts, setContacts }}>
      {children}
    </FetchUserContext.Provider>
  );
};
