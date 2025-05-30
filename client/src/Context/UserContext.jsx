import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const FetchUserContext = createContext();

export const UserDataFlowProvider = ({ children }) => {
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    const mockContacts = {
      user1: {
        id: "user1",
        name: "Jane",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jane",
        fav: false,
      },
      user2: {
        id: "user2",
        name: "May",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=May",
        fav: false,
      },
      user3: {
        id: "user3",
        name: "Jhon",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jhon",
        fav: false,
      },
      user4: {
        id: "user4",
        name: "Ali",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ali",
        fav: false,
      },
    };
    setContacts(mockContacts);
  }, []);

  return (
    <FetchUserContext.Provider value={{ contacts, setContacts }}>
      {children}
    </FetchUserContext.Provider>
  );
};
