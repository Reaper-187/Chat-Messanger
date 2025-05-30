import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const FetchLoginContext = createContext();

export const LoggedInUserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loggedUser = {
      ownUser: {
        id: "ownAccount",
        name: "Abdul",
        email: "abudlcheik@gmail.com",
        avatar: "...",
        isLoggedIn: true,
      },
    };

    setLoggedInUser(loggedUser.ownUser);
  }, []);

  return (
    <FetchLoginContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </FetchLoginContext.Provider>
  );
};
