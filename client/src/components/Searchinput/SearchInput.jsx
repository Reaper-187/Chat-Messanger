import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FetchChatContext } from "@/Context/MessagesContext";
import { ChatContactsContext } from "@/Context/chatContactsContext";
import { useDebounce } from "@/Hooks/DebounceHook/DebounceHook";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import axios from "axios";

const fetchContacts = import.meta.env.VITE_API_CONTACTS;

export const SearchInput = () => {
  const { setSelectedUserId } = useContext(FetchChatContext);
  const { addNewChatContact } = useContext(ChatContactsContext);
  const [searchContact, setSearchContact] = useState("");
  const debounceHook = useDebounce(searchContact);

  const { userProfile } = useAuth();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (debounceHook.trim() === "") return;

    const contactData = async () => {
      try {
        const res = await axios.get(fetchContacts);
        const allContacts = res.data.contacts;
        const filtered = allContacts.filter(
          (contact) =>
            contact._id !== userProfile._id &&
            contact.name.toLowerCase().includes(debounceHook.toLowerCase())
        );
        setContacts(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    contactData();
  }, [debounceHook, userProfile?._id]);

  function handleSelectedUser(user) {
    addNewChatContact(user);
  }

  return (
    <div className="relative w-[70%] m-2 z-15">
      <Input
        value={searchContact || ""}
        onChange={(e) => setSearchContact(e.target.value)}
        placeholder="Search for Contacts"
        className="shadow-0"
      />

      <div className="absolute w-full top-10 z-5">
        {searchContact.trim() !== "" && contacts.length > 0 && (
          <div className="absolute w-full p-1 bg--background rounded-b-lg">
            {contacts.map((contact) => (
              <div
                key={contact.email}
                className="flex justify-between rounded-lg p-1 cursor-pointer transition duration-300 hover:bg-[#ffffff1a]"
                onClick={() => {
                  setSelectedUserId(contact._id);
                  handleSelectedUser(contact);
                  setSearchContact("");
                }}
              >
                <div className=" w-full flex items-center justify-between my-1 ">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="w-full px-1">
                    <p className="text-xs text-black-500">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
