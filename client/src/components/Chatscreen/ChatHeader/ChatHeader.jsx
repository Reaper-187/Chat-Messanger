import { useContext } from "react";
import { CircleArrowLeft } from "lucide-react";
import { FetchChatContext } from "@/Context/MessagesContext";
import { FetchUserContext } from "@/Context/UserContext";
import { useIsMobile } from "@/Hooks/MediaHook";

export const ChatHeader = ({ onBack }) => {
  const isMobile = useIsMobile();
  const { selectedUserId } = useContext(FetchChatContext);
  const { contacts, loading } = useContext(FetchUserContext);
  const selectedUser = contacts.find((user) => user._id === selectedUserId);

  if (loading) return null;
  if (!selectedUserId || !selectedUser) return null;

  return (
    <div className="bg-gray-300 p-1 flex items-center">
      {isMobile && (
        <button onClick={onBack} className="mr-2 text-sm px-2 py-1 rounded">
          <CircleArrowLeft />
        </button>
      )}
      <img
        src={selectedUser.avatar}
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
