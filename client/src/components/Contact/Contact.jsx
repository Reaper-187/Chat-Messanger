import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { ChatlistTable } from "@/components/Chatlist/ChatlistTable";
import { SearchInput } from "../Searchinput/SearchInput";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const Contact = ({ mobileView }) => {
  const { userProfile } = useAuth();

  const navigate = useNavigate();
  if (!userProfile) return null;

  // console.log(userProfile.avatar);

  const renderProfile = (
    <div
      key={userProfile.email}
      className="flex justify-between items-center p-2"
    >
      <div className=" w-full flex items-center justify-between">
        <img
          src={`${backendUrl}/${userProfile.avatar}`}
          alt={userProfile.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="ml-2">
          <p>{userProfile.name}</p>
          <p className="text-xs text-gray-500">{userProfile.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className={
          mobileView ? "flex justify-center w-full bg-[#DDDDDD]" : "hidden"
        }
      >
        <SearchInput />
      </div>
      <div className="w-full h-full flex flex-col justify-between bg-[#DDDDDD] lg:w-80">
        <ChatlistTable />
        <div className="flex justify-between items-center w-full border-t px-1">
          {renderProfile}
          <Settings cursor={"pointer"} onClick={() => navigate("/settings")} />
        </div>
      </div>
    </div>
  );
};
