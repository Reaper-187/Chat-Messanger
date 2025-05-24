import { Outlet } from "react-router-dom";
import "./App.css";
import { Sidebar } from "@c/Sidebar/Sidebar";

export const App = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};
