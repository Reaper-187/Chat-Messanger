import React from "react";
import { Card } from "@c/ui/card";

export const Chatscreen = () => {
  const mockMessages = [
    { id: 1, senderId: "me", message: "Hey May!", timestamp: "12:00" },
    {
      id: 2,
      senderId: "maycheik@gmail.com",
      message: "Hey du!",
      timestamp: "12:01",
    },
    { id: 3, senderId: "me", message: "Wie geht's dir?", timestamp: "12:02" },
    {
      id: 4,
      senderId: "maycheik@gmail.com",
      message: "Alles gut, danke!",
      timestamp: "12:03",
    },
  ];

  return (
    <Card className="rounded-xs shadow-none bg-gray-400 min-h-full px-2">
      {mockMessages.map((data, index) => (
        <div
          key={index}
          className={
            data.senderId !== "me"
              ? "flex justify-start items-end"
              : "flex justify-end items-end"
          }
        >
          <div className="max-w-[70%] p-2 bg-white rounded-md shadow-sm">
            <p>{data.message}</p>
            <p className="text-xs text-gray-500">{data.timestamp}</p>
          </div>
        </div>
      ))}
    </Card>
  );
};
