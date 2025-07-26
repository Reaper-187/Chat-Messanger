import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { Settings } from "lucide-react";

import React from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const Sidebar = () => {
  const { userProfile } = useAuth();

  const navigate = useNavigate();
  if (!userProfile) return null;

  const renderProfile = (
    <div
      key={userProfile.email}
      className="flex justify-between items-center p-2 mt-2"
    >
      <div className=" w-full flex items-center justify-between">
        <img
          src={`${backendUrl}/${userProfile.avatar}`}
          alt={userProfile.name}
          className="w-10 h-10 rounded-full"
          loading="lazy"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col-reverse items-center bg-sidebar-foreground">
      {renderProfile}
      <Settings
        size={40}
        className="p-2 rounded-full hover:bg-[#ffffff1a] cursor-pointer transition-all druation-300"
        onClick={() => navigate("/settings")}
      />
    </div>
  );
};
