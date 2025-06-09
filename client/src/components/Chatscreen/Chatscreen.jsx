import React, { useContext, useRef } from "react";
import { Card } from "@/components/ui/card";
import { FetchChatContext } from "@/Context/ChatContext";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";

export const Chatscreen = () => {
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

  return (
    <Card className="rounded-xs shadow-none bg-gray-400 min-h-full px-2 space-y-2 py-2">
      {currentChatMessages.length === 0 ? (
        <p className="text-center text-gray-600 mt-4 text-sm">
          Start a conversation with .....
        </p>
      ) : (
        <AnimatePresence initial={false}>
          {currentChatMessages.map(({ from, text, timeStamp }, index) => (
            <motion.div
              key={index}
              className={
                from !== userProfile.id
                  ? "flex justify-start items-end"
                  : "flex justify-end items-end"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[70%] p-2 rounded-md shadow-sm ${
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
        </AnimatePresence>
      )}
      <div ref={endOfMessagesRef} />
    </Card>
  );
};
