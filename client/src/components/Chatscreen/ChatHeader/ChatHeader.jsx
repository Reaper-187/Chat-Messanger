import { useContext } from "react";
import { CircleArrowLeft } from "lucide-react";
import { FetchChatContext } from "@/Context/MessagesContext";
import { useIsMobile } from "@/Hooks/MediaHook";
import { ChatContactsContext } from "@/Context/chatContactsContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ChatHeader = ({ onBack }) => {
  const isMobile = useIsMobile();
  const { chatContacts } = useContext(ChatContactsContext);
  const { selectedUserId } = useContext(FetchChatContext);
  const selectedUser = chatContacts.find((user) => user._id === selectedUserId);

  if (!selectedUserId || !selectedUser) return null;

  const avatarUrl = selectedUser.avatar?.startsWith("https://api.dicebear.com")
    ? selectedUser.avatar
    : `${backendUrl}/${selectedUser.avatar}`;

  return (
    <div className="bg-(--backgroundHeader) p-1 flex items-center">
      {isMobile && (
        <button onClick={onBack} className="mr-2 text-sm px-2 py-1 rounded">
          <CircleArrowLeft />
        </button>
      )}
      <img
        src={avatarUrl}
        alt={selectedUser.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="px-2">
        <div className="font-semibold">{selectedUser.name}</div>
        <div className="text-xs text-gray-500">{selectedUser.email}</div>
      </div>
    </div>
  );
};
