import { Contact } from "@c/Contact/Contact";
import { Sidebar } from "@c/Sidebar/Sidebar";
import React from "react";

export const Chat = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Contact />
      <div>Chat-Seite</div>
    </div>
  );
};
