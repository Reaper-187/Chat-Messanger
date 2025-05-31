import React, { createContext, useContext, useState } from "react";
import { FetchLoginContext } from "./LoginContext";

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const { loggedInUser } = useContext(FetchLoginContext);

  const ownAccountId = loggedInUser?.ownUser;

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState([]);

  const [allChats, setAllChats] = useState({
    user2: [],
    user3: [],
  });

  const sendMessageToChat = () => {
    setAllChats((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), currentChatMessages],
    }));
  };

  return (
    <FetchChatContext.Provider
      value={{
        setAllChats,
        ownAccountId,
        selectedUserId,
        setSelectedUserId,
        currentChatMessages,
        setCurrentChatMessages,
        sendMessageToChat,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
