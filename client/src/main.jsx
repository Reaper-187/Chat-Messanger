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
import { GetAuthenticationProvider } from "./Context/Auth-Context/Auth-Context.jsx";
import { SocketProvider } from "./Context/SocketContext/SocketContext.jsx";
import { Toaster } from "sonner";
import { Login } from "./Pages/Sign-Authentication/Login.jsx";
import { Register } from "./Pages/Sign-Authentication/Register.jsx";
import {
  GuestRoute,
  ProtectedRoute,
  // OtpRoute,
  // VerificationRoute,
} from "@/components/Auth-Component/ProtectedRoute.jsx";
import "./index.css";
import { ChatContactsDataProvider } from "./Context/chatContactsContext.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  // {
  //   path: "/reset-password-authentication",
  //   element: <ForgotPw />,
  // },
  // {
  //   path: "/verifyUser",
  //   element: (
  //     <VerificationRoute>
  //       <Verification />
  //     </VerificationRoute>
  //   ),
  // },
  // {
  //   path: "/One-Time-Otp",
  //   element: (
  //     <OtpRoute>
  //       <OneTimeOtp />
  //     </OtpRoute>
  //   ),
  // },
  // {
  //   path: "/change-password",
  //   element: (
  //     <OtpRoute>
  //       <ChangePasswordPage />
  //     </OtpRoute>
  //   ),
  // },
  {
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/chat" replace /> },
      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <GetAuthenticationProvider>
    <UserDataFlowProvider>
      <SocketProvider>
        <ChatContactsDataProvider>
          <ChatDataFlowProvider>
            <Toaster />

            <RouterProvider router={router} />
          </ChatDataFlowProvider>
        </ChatContactsDataProvider>
      </SocketProvider>
    </UserDataFlowProvider>
  </GetAuthenticationProvider>
);
