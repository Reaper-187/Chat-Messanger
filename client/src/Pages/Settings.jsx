import React from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { ChangeProfilePic } from "@/components/Settings-Comp/ChangeProfilePic/ChangeProfilePic";

export const Settings = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 w-full">
        <h1 className="p-2 text-3xl font-bold mb-6">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Section */}
            <Section title="Account">
              <SettingItem label="Change profile picture" />
              <SettingItem label="Change password" />
            </Section>

            {/* Notifications Section */}
            <Section title="Notifications">
              <SettingItem label="Enable push notifications" />
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Appearance Section */}
            <Section title="Appearance">
              <SettingItem label="Switch theme (Light/Dark)" />
            </Section>
          </div>
        </div>
      </div>
      <div className="realtive">
        <div className="absolute absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2">
          <ChangeProfilePic />
        </div>
      </div>
    </div>
  );
};
const Section = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

const SettingItem = ({ label }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <span>{label}</span>
      <Link className="text-sm text-blue-500 hover:underline" to={`/${label}`}>
        Edit
      </Link>
    </div>
  );
};
