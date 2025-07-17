import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useSocket } from "@/Hooks/useSocket";
import { toast } from "sonner";
import { useAuth } from "./Auth-Context/Auth-Context";
import { ChatContactsContext } from "./chatContactsContext";

axios.defaults.withCredentials = true;

const API_CHATDATA = import.meta.env.VITE_API_CHATDATA;
const API_RESETUNREADMESSAGE = import.meta.env.VITE_API_RESETUNREADMESSAGE;
const API_ALLUNREADMESSAGE = import.meta.env.VITE_API_ALLUNREADMESSAGE;
const API_SORTCONTACT = import.meta.env.VITE_API_SORTCONTACTS;

export const FetchChatContext = createContext();

export const ChatDataFlowProvider = ({ children }) => {
  const { isAuthStatus } = useAuth();
  const socket = useSocket();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [userGotNewMessage, setUserGotNewMessage] = useState({});
  const [latestSortedChats, setLatestSortedChats] = useState([]);

  const fetchChatData = async () => {
    if (!selectedUserId) return;
    try {
      const res = await axios.get(`${API_CHATDATA}/${selectedUserId}`);
      setCurrentChatMessages(res.data.chats);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  const handleReceiveMessage = useCallback(
    (message) => {
      const isActive =
        message.from === selectedUserId || message.to === selectedUserId;

      fetchSortContacts();
      if (isActive) {
        setCurrentChatMessages((prev) => [...prev, message]);
      }

      if (!isActive) {
        toast.success(message.name + ": " + message.text);
        setUserGotNewMessage((prev) => ({
          ...prev,
          [message.from]: (prev[message.from] || 0) + 1,
        }));
      }
    },
    [selectedUserId]
  );

  const fetchUnread = useCallback(async () => {
    try {
      const fetchUnreadData = await axios.get(API_ALLUNREADMESSAGE);
      const { messages } = fetchUnreadData.data;

      const counter = messages.reduce((acc, message) => {
        acc[message.from] = message.count;
        return acc;
      }, {});

      setUserGotNewMessage(counter);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const resetUnread = async () => {
    if (!selectedUserId || !userGotNewMessage?.[selectedUserId]) return;
    try {
      const res = await axios.post(
        `${API_RESETUNREADMESSAGE}/${selectedUserId}`
      );
      console.log("Post ausgeführt", res);
      setUserGotNewMessage((prev) => ({
        ...prev,
        [selectedUserId]: 0,
      }));
    } catch (err) {
      console.error("Error reset unread messages", err);
    }
  };

  const fetchSortContacts = useCallback(async () => {
    try {
      const res = await axios.get(API_SORTCONTACT);
      setLatestSortedChats(res.data.latestMsgOfContact);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthStatus?.loggedIn) fetchSortContacts();
  }, [isAuthStatus?.loggedIn]);

  useEffect(() => {
    if (userGotNewMessage?.[selectedUserId] > 0) {
      resetUnread();
    }
    fetchChatData();
  }, [selectedUserId]);

  const refreshChatList = async () => {
    await fetchUnread();
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, refreshChatList, handleReceiveMessage]);

  return (
    <FetchChatContext.Provider
      value={{
        selectedUserId,
        setSelectedUserId,
        currentChatMessages,
        setCurrentChatMessages,
        fetchChatData,
        userGotNewMessage,
        latestSortedChats,
        fetchSortContacts,
      }}
    >
      {children}
    </FetchChatContext.Provider>
  );
};
