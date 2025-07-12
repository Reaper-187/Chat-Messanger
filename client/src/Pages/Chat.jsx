import React, { useContext, useEffect, useState } from "react";
import { Chatscreen } from "@/components/Chatscreen/Chatscreen";
import { Contact } from "@/components/Contact/Contact";
import { useIsMobile } from "@/Hooks/MediaHook";
import { FetchChatContext } from "@/Context/MessagesContext";
import { SearchInput } from "@/components/Searchinput/SearchInput";

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
          <Chatscreen
            onBack={handleBackToContacts}
            mobileView={setIsMobileChatOpen}
          />
        ) : (
          <div className="h-full">
            <Contact mobileView={setIsMobileChatOpen} />
          </div>
        )}
      </div>
    );
  }

  // Desktop-Ansicht
  return (
    <div className="flex h-screen ">
      <div className="flex">
        <Contact />
      </div>
      <div className="w-full h-full flex flex-col">
        <Chatscreen />
      </div>
    </div>
  );
};
