import { useRef, useEffect, createContext } from "react";
import { useAuth } from "../Auth-Context/Auth-Context";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthStatus } = useAuth();

  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthStatus?.loggedIn && !socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        autoConnect: false,
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Verbunden mit Socket:");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket getrennt");
      });

      socketRef.current.connect();
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isAuthStatus?.loggedIn]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
