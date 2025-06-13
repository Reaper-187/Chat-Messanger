import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FetchUserContext } from "@/Context/UserContext";
const fetchContacts = import.meta.env.VITE_API_CONTACTS;

export const SearchInput = () => {
  const [searchContact, setSearchContact] = useState("");

  const { contactData } = useContext(FetchUserContext);

  const findContact = async (values) => {
    setSearchContact(values);

    const filterData = await contactData(searchContact);
    console.log("filterData", filterData);

    if (findContact) {
      return (
        <div
          key={filterData.email}
          className="flex justify-between items-center p-1"
        >
          <div className=" w-full flex items-center justify-between">
            <img
              src={filterData.avatar}
              alt={filterData.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="w-full px-1">
              <div className="flex justify-between items-center">
                <div className="flex justify-between w-full">
                  {filterData.name}
                  {isAuthStatus ? (
                    <p className="text-green-400">on</p>
                  ) : (
                    <p className="text-red-400">off</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">{filterData.email}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Input
        onChange={(e) => findContact(e.target.value)}
        placeholder="Search for Contacts"
        className="border-b-0 rounded-b-xs"
      />
    </>
  );
};
