import React, { useContext, useRef, useEffect } from "react";
import { Card } from "@c/ui/card";
import { FetchChatContext } from "src/Context/ChatContext";
import { FetchLoginContext } from "src/Context/LoginContext";
import { motion, AnimatePresence } from "framer-motion";

export const Chatscreen = () => {
  const { currentChatMessages } = useContext(FetchChatContext);
  const { ownAccountId } = useContext(FetchLoginContext);
  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages]);

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
          {currentChatMessages.map(({ id, senderId, text, timeStamp }) => (
            <motion.div
              key={id}
              className={
                senderId !== ownAccountId
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
                  senderId === ownAccountId ? "bg-blue-100" : "bg-white"
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
