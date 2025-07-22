import React, { useContext, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { FetchChatContext } from "@/Context/MessagesContext";
import { motion } from "framer-motion";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { MessageInput } from "../MessageInput/MessageInput";
import { ChatHeader } from "./ChatHeader/ChatHeader";
import { SearchInput } from "../Searchinput/SearchInput";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Chatscreen = ({ onBack, mobileView }) => {
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
    <Card className="relative w-full flex flex-col h-full p-0 gap-0 border-none rounded-none">
      <div
        className={
          mobileView
            ? "hidden"
            : "flex justify-center w-full bg-(--background)]"
        }
      >
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
            {currentChatMessages.map(
              ({ from, text, timeStamp, mediaUrl }, index) => (
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
                        ? "bg-[var(--me-msg)]"
                        : "bg-[var(--he-msg)]"
                    }`}
                  >
                    {mediaUrl && (
                      <img
                        src={backendUrl + mediaUrl}
                        className="max-w-[250px] max-h-[250px] rounded-lg object-cover"
                      />
                    )}

                    {text.includes("maps.google.com") ? (
                      <a
                        href={text}
                        target="_blank"
                        className="text-sm text-[var(--msg-text)]"
                      >
                        {text}
                      </a>
                    ) : (
                      <p className="text-sm text-[var(--msg-text)]">{text}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        from === userProfile._id
                          ? "text-gray-500"
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
              )
            )}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>
      {selectedUserId && (
        <div className="sticky flex self-center w-[95%] p-2 lg:w-[70%]">
          <MessageInput />
        </div>
      )}
    </Card>
  );
};
