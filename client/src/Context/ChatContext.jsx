import React, { createContext, useState } from "react";

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ownAccountId, setOwnAccountId] = useState("me");

  const mockChats = {
    user2: [
      {
        id: "m1",
        senderId: ownAccountId,
        text: "Hey May, wie geht’s?",
        timestamp: "2025-05-26T10:00:00Z",
      },
      {
        id: "m2",
        senderId: "user2",
        text: "Hey Abdul! Alles gut, und dir?",
        timestamp: "2025-05-26T10:01:00Z",
      },
    ],
    user3: [
      {
        id: "m3",
        senderId: "user3",
        text: "Moin Abdul!",
        timestamp: "2025-05-25T14:30:00Z",
      },
      {
        id: "m4",
        senderId: ownAccountId,
        text: "Hey Jhon, was geht?",
        timestamp: "2025-05-25T14:31:00Z",
      },
    ],
  };

  // Diese Funktion setzt den aktuell ausgewählten Chat und lädt die passenden Nachrichten
  const selectUser = (userId) => {
    setSelectedUserId(userId);
    setMessages(mockChats[userId] || []);
  };

  return (
    <FetchChatContext.Provider
      value={{
        selectedUserId,
        messages,
        selectUser,
        ownAccountId,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
