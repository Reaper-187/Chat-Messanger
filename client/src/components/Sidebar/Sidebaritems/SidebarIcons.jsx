import React from "react";
import { Home, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sideBarItems = [
  { icon: <Home />, label: "Home", path: "/home" },
  { icon: <User />, label: "Account", path: "/account" },
];

export const SidebarIcons = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {sideBarItems.map((item, index) => (
        <div
          key={index}
          onClick={() => item.path && navigate(item.path)}
          className="cursor-pointer relative flex items-center my-5 p-3 rounded-md transition-bg duration-300"
        >
          <div className="relative group">
            <div>{item.icon}</div>
            <p className="absolute left-10 top-1/2 -translate-y-1/2 p-2 rounded-md bg-blue-200 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {item.label}
            </p>
          </div>
        </div>
      ))}
      <div className="relative flex items-center my-5 p-3 rounded-md transition-bg duration-300 cursor-pointer">
        <div className="relative group">
          <LogOut />
          <p className="absolute left-10 top-1/2 -translate-y-1/2 p-2 rounded-md bg-blue-200 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Logout
          </p>
        </div>
      </div>
    </div>
  );
};
