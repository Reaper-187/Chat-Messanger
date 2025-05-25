import { ChatHeader } from "@c/Chatscreen/ChatHeader/ChatHeader";
import { Contact } from "@c/Contact/Contact";
import { SearchInput } from "@c/Searchinput/SearchInput";
import { Sidebar } from "@c/Sidebar/Sidebar";
import React from "react";

export const Chat = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Contact />
      <div className="w-400 m-auto">
        <SearchInput />
        <ChatHeader />
      </div>
      {/* Chat-History */}
      {/* office-klammer*/}
      {/* Input */}
      {/* submit-message */}
    </div>
  );
};
