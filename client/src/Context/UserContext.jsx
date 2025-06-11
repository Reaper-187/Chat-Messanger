import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Auth-Context/Auth-Context";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const FetchUserContext = createContext();
const fetchContacts = import.meta.env.VITE_API_CONTACTS;

export const UserDataFlowProvider = ({ children }) => {
  const { userProfile } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const contactData = async () => {
      try {
        const contactData = await axios.get(fetchContacts);
        const allContacts = contactData.data.contacts;
        const filteredContacts = allContacts.filter(
          (contact) => contact._id !== userProfile.id
        );
        setContacts(filteredContacts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userProfile?.id) contactData();
  }, [userProfile]);

  return (
    <FetchUserContext.Provider value={{ contacts, setContacts, loading }}>
      {children}
    </FetchUserContext.Provider>
  );
};
