import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export const Logout = () => {
  const location = useLocation();
  const { logoutUser } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const logoutRes = await logoutUser();
      if (logoutRes) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during the Logout:", err);
    }
  };

  return (
    <div onClick={handleLogout}>
      <span
        className={`word ${location.pathname === "/login" ? "active" : ""}`}
        data-text="Logout"
      >
        <LogOut className="w-fit flex justify-start px-1 cursor-pointer" />
      </span>
    </div>
  );
};
