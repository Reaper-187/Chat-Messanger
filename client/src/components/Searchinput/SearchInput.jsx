import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FetchUserContext } from "@/Context/UserContext";
import { FetchChatContext } from "@/Context/MessagesContext";
import { ChatContactsContext } from "@/Context/chatContactsContext";

export const SearchInput = () => {
  const { setSelectedUserId } = useContext(FetchChatContext);
  const { addNewChatContact } = useContext(ChatContactsContext);
  const [searchContact, setSearchContact] = useState(null);
  const { contacts } = useContext(FetchUserContext);

  function handleSelectedUser(user) {
    addNewChatContact(user);
  }

  const filterData = searchContact
    ? contacts?.filter((contact) =>
        contact.name.toLowerCase().includes(searchContact.toLowerCase())
      )
    : [];
  return (
    <div className="relative w-full">
      <Input
        onChange={(e) => setSearchContact(e.target.value)}
        placeholder="Search for Contacts"
        className="border-b-0 rounded-b-xs"
      />
      {filterData.length > 0 && (
        <div className="absolute w-full bg-gray-300 z-5 p-1">
          {filterData?.map((contact) => (
            <div
              key={contact.email}
              className="flex justify-between rounded-lg p-1 cursor-pointer transition duration-300 hover:bg-gray-400"
              onClick={() => {
                setSelectedUserId(contact._id), handleSelectedUser(contact);
                setSearchContact(null);
              }}
            >
              <div className=" w-full flex items-center justify-between ">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="w-full px-1">
                  <p className="text-xs text-balck-500">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
