import React, { useContext, useEffect, useState } from "react";
import { ChatHeader } from "@/components/Chatscreen/ChatHeader/ChatHeader";
import { Chatscreen } from "@/components/Chatscreen/Chatscreen";
import { Contact } from "@/components/Contact/Contact";
import { MessageInput } from "@/components/MessageInput/MessageInput";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useIsMobile } from "@/Hooks/MediaHook";
import { FetchChatContext } from "@/Context/MessagesContext";

export const Chat = () => {
  const isMobile = useIsMobile();
  const { selectedUserId } = useContext(FetchChatContext); // oder z. B. aus dem Context
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    if (isMobile && selectedUserId) {
      setIsMobileChatOpen(true);
    }
  }, [selectedUserId, isMobile]);

  const handleBackToContacts = () => {
    setIsMobileChatOpen(false);
  };

  if (isMobile) {
    return (
      <div className="h-screen w-full">
        {isMobileChatOpen ? (
          <div className="flex flex-col h-full">
            <ChatHeader onBack={handleBackToContacts} />
            <div className="flex-1 overflow-y-auto">
              <Chatscreen />
            </div>
            <MessageInput />
          </div>
        ) : (
          <div className="h-full">
            <Contact />
          </div>
        )}
      </div>
    );
  }

  // Desktop-Ansicht
  return (
    <div className="flex h-screen">
      <div className="flex">
        <Sidebar />
        <Contact />
      </div>
      <div className="w-full h-full flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <Chatscreen />
        </div>
        <MessageInput />
      </div>
    </div>
  );
};
