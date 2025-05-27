import React, { useState } from "react";
import { ChatHeader } from "@c/Chatscreen/ChatHeader/ChatHeader";
import { Chatscreen } from "@c/Chatscreen/Chatscreen";
import { Contact } from "@c/Contact/Contact";
import { MessageInput } from "@c/MessageInput/MessageInput";
import { SearchInput } from "@c/Searchinput/SearchInput";
import { Sidebar } from "@c/Sidebar/Sidebar";

export const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  console.log(selectedUser);

  return (
    <div className="flex h-screen">
      <div className="flex">
        <Sidebar />
        <Contact onSelectUser={setSelectedUser} />
      </div>
      {selectedUser ? (
        <div className="w-full h-full flex flex-col">
          <SearchInput />
          <ChatHeader user={selectedUser} />
          <div className="flex-1 overflow-y-auto">
            <Chatscreen user={selectedUser} />
          </div>
          <MessageInput user={selectedUser} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Wähle einen Kontakt aus, um den Chat zu starten
        </div>
      )}
    </div>
  );
};
