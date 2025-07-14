import React from "react";
import { ChatlistTable } from "@/components/Chatlist/ChatlistTable";
import { SearchInput } from "../Searchinput/SearchInput";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const Contact = ({ mobileView }) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className={
          mobileView ? "flex justify-center w-full bg-background" : "hidden"
        }
      >
        <SearchInput />
      </div>
      <div className="w-full h-full flex flex-col justify-between bg-background lg:w-100">
        <ChatlistTable />
      </div>
    </div>
  );
};
