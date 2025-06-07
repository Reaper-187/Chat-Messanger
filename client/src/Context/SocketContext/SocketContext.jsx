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
        withCredentials: true,
      });

      socketRef.current.on("connection", () => {
        console.log("Verbunden mit Socket:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket getrennt");
      });
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
