import React, { useContext, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { FetchChatContext } from "@/Context/MessagesContext";

import { motion } from "framer-motion";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { MessageInput } from "../MessageInput/MessageInput";
import { ChatHeader } from "./ChatHeader/ChatHeader";
import { SearchInput } from "../Searchinput/SearchInput";

export const Chatscreen = ({ onBack }) => {
  const { userProfile } = useAuth();

  const { currentChatMessages, selectedUserId } = useContext(FetchChatContext);

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
      <div>
        <SearchInput />
      </div>
      <div className="sticky top-0 w-full z-10">
        <ChatHeader onBack={onBack} />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {currentChatMessages.length === 0 ? (
          <p className="text-center text-gray-600 mt-4 text-sm">
            Start a conversation with .....
          </p>
        ) : (
          <div className="space-y-2 p-2">
            {currentChatMessages.map(({ from, text, timeStamp }, index) => (
              <motion.div
                key={index}
                className={
                  from !== userProfile._id
                    ? "flex justify-start"
                    : "flex justify-end"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[50%] p-3 rounded-lg break-words ${
                    from === userProfile._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      from === userProfile._id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(timeStamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>
      {selectedUserId && (
        <div className="sticky bottom-0 w-full bg-gray-200 p-2">
          <MessageInput />
        </div>
      )}
    </Card>
  );
};
