import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { Chat } from "./Pages/Chat.jsx";
import { Settings } from "./Pages/Settings.jsx";
import { UserDataFlowProvider } from "./Context/UserContext.jsx";
import { ChatDataFlowProvider } from "./Context/ChatContext.jsx";
import "./index.css";
import { LoggedInUserProvider } from "./Context/LoginContext.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/chat" replace /> },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <LoggedInUserProvider>
    <UserDataFlowProvider>
      <ChatDataFlowProvider>
        <RouterProvider router={router} />
      </ChatDataFlowProvider>
    </UserDataFlowProvider>
  </LoggedInUserProvider>
);
