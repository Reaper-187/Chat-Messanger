import React from "react";
import { Sidebar } from "@/components/Sidebar/Sidebar";

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
              <SettingItem label="Edit username" />
              <SettingItem label="Change password" />
              <SettingItem label="Delete account" />
            </Section>

            {/* Notifications Section */}
            <Section title="Notifications">
              <SettingItem label="Enable push notifications" />
              <SettingItem label="Play sound for new messages" />
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Appearance Section */}
            <Section title="Appearance">
              <SettingItem label="Switch theme (Light/Dark)" />
              <SettingItem label="Select language" />
              <SettingItem label="Adjust font size" />
            </Section>

            {/* Privacy Section */}
            <Section title="Privacy">
              <SettingItem label="Hide online status" />
              <SettingItem label="Disable read receipts" />
              <SettingItem label="Manage blocked contacts" />
            </Section>
          </div>
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
      <button className="text-sm text-blue-500 hover:underline">Edit</button>
    </div>
  );
};
