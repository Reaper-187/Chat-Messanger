import React from "react";
import { SidebarIcons } from "./Sidebaritems/SidebarIcons";

export const Sidebar = () => {
  return (
    <>
      <aside className="bg-gray-200 w-15 min-h-screen">
        <div className="flex flex-col justify-between items-center">
          <SidebarIcons />
        </div>
      </aside>
    </>
  );
};
