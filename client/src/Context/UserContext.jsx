import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const FetchUserContext = createContext();
const fetchContacts = import.meta.env.VITE_API_CONTACTS;

export const UserDataFlowProvider = ({ children }) => {
  const [contacts, setContacts] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    try {
      const mockContacts = async () => {
        const contactData = await axios.get(fetchContacts);
        const allContacts = contactData.data.contacts;
        setContacts(allContacts);
      };
      mockContacts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  console.log(contacts);

  return (
    <FetchUserContext.Provider value={{ contacts, setContacts, loading }}>
      {children}
    </FetchUserContext.Provider>
  );
};
