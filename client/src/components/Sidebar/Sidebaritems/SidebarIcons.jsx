import React from "react";
import { Settings, Home, User, LogOut, Moon, Sun } from "lucide-react";

const sideBarItems = [
  { icon: <Home />, label: "Home" },
  { icon: <User />, label: "User" },
  { icon: <Moon />, label: "Dark" },
  { icon: <Sun />, label: "Light" },
  { icon: <LogOut />, label: "LogOut" },
  { icon: <Settings />, label: "Settings" },
];

export const SidebarIcons = () => {
  return (
    <>
      {sideBarItems.map((item, index) => (
        <div
          key={index}
          className="group cursor-pointer relative flex items-center my-5 p-3 rounded-md hover:bg-blue-400 transition-bg duration-300"
        >
          {item.icon}
          <p className="absolute left-20 p-2 rounded-md bg-blue-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            {item.label}
          </p>
        </div>
      ))}
    </>
  );
};
