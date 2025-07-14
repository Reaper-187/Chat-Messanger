import React, { useEffect, useState } from "react";
import { ChangeProfilePic } from "@/components/Settings-Comp/ChangeProfilePic/ChangeProfilePic";
import { Card } from "@/components/ui/card";
import { ArrowBigLeft, LogOut, Moon, Sun, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logout } from "@/components/Settings-Comp/Logout/Logout";

export const Settings = () => {
  const [activeSetting, setActiveSetting] = useState(null);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className="flex flex-col">
      <div className="p-4">
        <ArrowBigLeft
          size={40}
          className=" p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer transition-all druation-300"
          onClick={() => navigate("/chat")}
        />
      </div>
      <div className="p-4 w-full">
        <h1 className="p-2 text-3xl font-bold mb-6">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Section */}
            <Section title="Account">
              <Card className="flex justify-between items-center flex-row p-2">
                <p>Change profile picture</p>
                <UserPen
                  className="w-fit flex justify-start px-1 cursor-pointer"
                  onClick={() => setActiveSetting("changeProfilePic")}
                />
              </Card>
            </Section>
            <Section title="Theme-Switch">
              <Card className="flex justify-between items-center flex-row p-1">
                Theme Switch
                <div
                  onClick={() => toggleTheme()}
                  className={`relative w-14 h-8 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${
                    theme === "dark" ? "bg-gray-700" : "bg-yellow-400"
                  }`}
                >
                  <Sun className="w-4 h-4 text-white" />
                  <Moon className="w-4 h-4 text-white ml-auto" />
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      theme === "dark" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </Card>
            </Section>
            <Section title="Log-Out">
              <Card className="flex justify-between items-center flex-row p-2">
                Log out
                <Logout />
              </Card>
            </Section>
          </div>
        </div>
      </div>
      <div className="realtive">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          {activeSetting === "changeProfilePic" && (
            <ChangeProfilePic onClose={() => setActiveSetting(null)} />
          )}
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
