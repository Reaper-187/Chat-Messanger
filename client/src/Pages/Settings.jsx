import React, { useContext, useState } from "react";
import { ChangeProfilePic } from "@/components/Settings-Comp/ChangeProfilePic/ChangeProfilePic";
import { Card } from "@/components/ui/card";
import { ArrowBigLeft, Moon, Sun, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logout } from "@/components/Settings-Comp/Logout/Logout";
import { ThemeContext } from "@/Context/Theme/ThemeContext";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Settings = () => {
  const { userProfile } = useAuth();

  const { toggleTheme, theme } = useContext(ThemeContext);
  const [activeSetting, setActiveSetting] = useState(null);

  const navigate = useNavigate();
  if (!userProfile) return null;

  const userImage = (
    <img
      src={`${backendUrl}/${userProfile.avatar}`}
      alt={userProfile.name}
      className="w-50 h-50 rounded-full"
    />
  );
  return (
    <div className="flex flex-col">
      <div className="flex items-center p-2">
        <div>
          <ArrowBigLeft
            size={40}
            className=" p-1 rounded-full hover:bg-[#ffffff1a] cursor-pointer transition-all druation-300"
            onClick={() => navigate("/chat")}
          />
        </div>

        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="flex flex-col items-center p-2 gap-6">
        <div className="flex justify-center">{userImage}</div>

        <div className="w-full max-w-md space-y-6">
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
            <Card className="flex justify-between items-center flex-row p-2 text-red-400">
              Log out
              <Logout />
            </Card>
          </Section>
        </div>
        {activeSetting === "changeProfilePic" && (
          <div className="absolute top-0 bg-black/50 w-full h-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
              <ChangeProfilePic onClose={() => setActiveSetting(null)} />
            </div>
          </div>
        )}
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
