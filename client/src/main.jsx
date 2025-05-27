import React from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { App } from "./App.jsx";
import { Chat } from "./Pages/Chat.jsx";
import "./index.css";
import { Settings } from "./Pages/Settings.jsx";

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
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
