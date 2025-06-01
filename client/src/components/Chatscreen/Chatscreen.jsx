import React, { useContext } from "react";
import { Card } from "@c/ui/card";
import { FetchChatContext } from "src/Context/ChatContext";
import { FetchLoginContext } from "src/Context/LoginContext";

export const Chatscreen = () => {
  const { currentChatMessages } = useContext(FetchChatContext);
  const { ownAccountId } = useContext(FetchLoginContext);

  {
    currentChatMessages.length === 0 && (
      <p className="text-center text-gray-600 mt-4 text-sm">
        Starte eine Unterhaltung 🚀
      </p>
    );
  }

  return (
    <Card className="rounded-xs shadow-none bg-gray-400 min-h-full px-2 space-y-2 py-2">
      {currentChatMessages.length === 0 ? (
        <p className="text-center text-gray-600 mt-4 text-sm">
          Start a conversation with .....
        </p>
      ) : (
        currentChatMessages.map(({ id, senderId, text, timeStamp }) => (
          <div
            key={id}
            className={
              senderId !== ownAccountId
                ? "flex justify-start items-end"
                : "flex justify-end items-end"
            }
          >
            <div
              className={`max-w-[70%] p-2 rounded-md shadow-sm ${
                senderId === ownAccountId ? "bg-blue-100" : "bg-white"
              }`}
            >
              <p>{text}</p>
              <p className="text-xs text-gray-500">
                {new Date(timeStamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))
      )}
    </Card>
  );
};
