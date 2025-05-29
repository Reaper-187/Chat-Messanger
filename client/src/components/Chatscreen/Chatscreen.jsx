import React, { useContext } from "react";
import { Card } from "@c/ui/card";
import { FetchChatContext } from "src/Context/ChatContext";

export const Chatscreen = () => {
  const { messages, ownAccountId } = useContext(FetchChatContext);

  {
    messages.length === 0 && (
      <p className="text-center text-gray-600 mt-4 text-sm">
        Starte eine Unterhaltung 🚀
      </p>
    );
  }

  return (
    <Card className="rounded-xs shadow-none bg-gray-400 min-h-full px-2 space-y-2 py-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.senderId !== ownAccountId
              ? "flex justify-start items-end"
              : "flex justify-end items-end"
          }
        >
          <div
            className={`max-w-[70%] p-2 rounded-md shadow-sm ${
              msg.senderId === ownAccountId ? "bg-blue-100" : "bg-white"
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500">{msg.timestamp}</p>
          </div>
        </div>
      ))}
    </Card>
  );
};
