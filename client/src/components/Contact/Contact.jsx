import { Chatlist } from "@c/Chatlist/Chatlist";
import React from "react";

export const Contact = () => {
  return (
    <>
      <div className="w-50 h-full flex flex-col justify-between bg-gray-100">
        <div>
          <div className="flex flex-col">
            <label className="p-2">Contacts</label>
            <span className="w-full border-t" />
          </div>
          <Chatlist />
        </div>
        <div>
          <div className="flex flex-col">
            <span className="w-full border-t" />
            <label className="p-3">Person</label>
          </div>
        </div>
      </div>
    </>
  );
};
