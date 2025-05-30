import React, { createContext, useContext, useState } from "react";
import { FetchLoginContext } from "./LoginContext";

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const { loggedInUser } = useContext(FetchLoginContext);

  const ownAccountId = loggedInUser?.ownUser;

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [allChats, setAllChats] = useState({
    user2: [],
    user3: [],
  });

  const sendMessageToChat = () => {};

  return (
    <FetchChatContext.Provider
      value={{
        selectedUserId,
        messages,
        selectUser,
        ownAccountId,
        setMessages,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
