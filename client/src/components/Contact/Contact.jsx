import React from "react";
import { ChatlistTable } from "@/components/Chatlist/ChatlistTable";
import { SearchInput } from "../Searchinput/SearchInput";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

export const Contact = ({ mobileView }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className={
          mobileView
            ? "flex justify-between items-center w-full bg-(--background)"
            : "hidden"
        }
      >
        <SearchInput />
        <Settings
          size={40}
          className="p-2 rounded-full hover:bg-[#ffffff1a] cursor-pointer transition-all druation-300"
          onClick={() => navigate("/settings")}
        />
      </div>
      <div className="w-full h-full flex flex-col justify-between bg-(--background) lg:w-100">
        <ChatlistTable />
      </div>
    </div>
  );
};
