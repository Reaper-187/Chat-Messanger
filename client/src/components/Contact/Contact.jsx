import React, { useContext } from "react";
import { Chatlist } from "@c/Chatlist/Chatlist";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@c/Searchinput/SearchInput";
import { useAuth } from "src/Context/Auth-Context/Auth-Context";

export const Contact = () => {
  const { isAuthStatus, userProfile } = useAuth();

  const navigate = useNavigate();
  if (!userProfile) return null;

  const renderProfile = (
    <div
      key={userProfile.email}
      className="flex justify-between items-center p-1"
    >
      <div className=" w-full flex items-center justify-between">
        <img
          src={userProfile.avatar}
          alt={userProfile.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="w-full px-1">
          <div className="flex justify-between items-center">
            <div className="flex justify-between w-full">
              {userProfile.name}
              {isAuthStatus ? (
                <p className="text-green-400">on</p>
              ) : (
                <p className="text-red-400">off</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500">{userProfile.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full h-full flex flex-col justify-between bg-gray-100 lg:w-80">
        <div>
          <SearchInput />

          <div className="flex flex-col">
            <span className="w-full border-t" />
          </div>
          <Chatlist />
        </div>
        <div className="flex justify-between items-center w-full border-t p-1">
          {renderProfile}{" "}
          <Settings cursor={"pointer"} onClick={() => navigate("/settings")} />
        </div>
      </div>
    </>
  );
};
