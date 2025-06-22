import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { ChatlistTable } from "@/components/Chatlist/ChatlistTable";

export const Contact = () => {
  const { isAuthStatus, userProfile } = useAuth();

  const navigate = useNavigate();
  if (!userProfile) return null;

  console.log(userProfile.avatar);

  const renderProfile = (
    <div
      key={userProfile.email}
      className="flex justify-between items-center p-2"
    >
      <div className=" w-full flex items-center justify-between">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/${userProfile.avatar}`}
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
    <>
      <div className="w-full h-full flex flex-col justify-between bg-gray-100 lg:w-80">
        <ChatlistTable />
        <div className="flex justify-between items-center w-full border-t px-1">
          {renderProfile}
          <Settings cursor={"pointer"} onClick={() => navigate("/settings")} />
        </div>
      </div>
    </>
  );
};
