import React from "react";
import { ChatHeader } from "@c/Chatscreen/ChatHeader/ChatHeader";
import { Chatscreen } from "@c/Chatscreen/Chatscreen";
import { Contact } from "@c/Contact/Contact";
import { MessageInput } from "@c/MessageInput/MessageInput";
import { SearchInput } from "@c/Searchinput/SearchInput";
import { Sidebar } from "@c/Sidebar/Sidebar";

export const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="flex">
        <Sidebar />
        <Contact />
      </div>
      <div className="w-full h-full flex flex-col">
        <SearchInput />
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <Chatscreen />
        </div>
        <MessageInput />
      </div>
    </div>
  );
};
