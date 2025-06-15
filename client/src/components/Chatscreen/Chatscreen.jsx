import React, { useContext, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { FetchChatContext } from "@/Context/MessagesContext";

import { motion } from "framer-motion";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { MessageInput } from "../MessageInput/MessageInput";
import { ChatHeader } from "./ChatHeader/ChatHeader";

export const Chatscreen = ({ onBack }) => {
  const { userProfile } = useAuth();

  const { currentChatMessages } = useContext(FetchChatContext);

  const endOfMessagesRef = useRef(null);

  {
    currentChatMessages.length === 0 && (
      <p className="text-center text-gray-600 mt-4 text-sm">
        Starte eine Unterhaltung 🚀
      </p>
    );
  }

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages]);

  return (
    <Card className="relative w-full flex flex-col h-full p-0 gap-0">
      <div className="sticky top-0 w-full z-10">
        <ChatHeader onBack={onBack} />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {currentChatMessages.length === 0 ? (
          <p className="text-center text-gray-600 mt-4 text-sm">
            Start a conversation with .....
          </p>
        ) : (
          <div>
            {currentChatMessages.map(({ from, text, timeStamp }, index) => (
              <motion.div
                key={index}
                className={
                  from !== userProfile.id
                    ? "flex justify-start items-end m-2"
                    : "flex justify-end items-end m-2"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[50%] p-2 rounded-md shadow-sm ${
                    from === userProfile.id ? "bg-blue-100" : "bg-white"
                  }`}
                >
                  <p>{text}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(timeStamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>
      <div className="sticky bottom-0 w-full bg-gray-200 p-2">
        <MessageInput />
      </div>
    </Card>
  );
};
