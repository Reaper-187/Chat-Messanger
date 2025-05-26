import { Chatlist } from "@c/Chatlist/Chatlist";
import { Settings } from "lucide-react";
import React from "react";

export const Contact = () => {
  const loggedInUser = {
    name: "Abdul",
    email: "abudlcheik@gmail.com",
    fav: false,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Abdul",
    isLoggedIn: false,
  };

  const renderUser = (
    <div
      key={loggedInUser.email}
      className="flex justify-between items-center p-1"
    >
      <div className=" w-full flex items-center justify-between">
        <img
          src={loggedInUser.avatar}
          alt={loggedInUser.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="w-full px-1">
          <div className="flex justify-between items-center">
            <p className="flex justify-between w-full">
              {loggedInUser.name}
              {loggedInUser.isLoggedIn ? (
                <p className="text-green-400">on</p>
              ) : (
                <p className="text-red-400">off</p>
              )}
            </p>
          </div>
          <p className="text-xs text-gray-500">{loggedInUser.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-80 h-full flex flex-col justify-between bg-gray-100">
        <div>
          <div className="flex flex-col">
            <span className="w-full border-t" />
          </div>
          <Chatlist />
        </div>
        <div className="flex justify-between items-center w-full border-t p-1">
          {renderUser} <Settings cursor={"pointer"} />
        </div>
      </div>
    </>
  );
};
