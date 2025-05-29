import { useContext } from "react";
import { FetchChatContext } from "src/Context/ChatContext";
import { FetchUserContext } from "src/Context/UserContext";

export const ChatHeader = () => {
  const { selectedUserId } = useContext(FetchChatContext);
  const { contacts } = useContext(FetchUserContext);
  const selectedUser = contacts[selectedUserId];
  console.log("ChatHeader:", selectedUser);
  if (!selectedUserId || !selectedUser) return null;

  return (
    <div className="bg-gray-300">
      <div
        key={selectedUser.email}
        className="flex justify-between items-center p-1"
      >
        <div className="w-full flex items-center justify-between">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="w-full px-1">
            <div className="flex items-center">
              <div className="flex gap-2 font-semibold">
                {selectedUser.name}
                {selectedUser.isLoggedIn ? (
                  <p className="text-green-400">on</p>
                ) : (
                  <p className="text-red-400">off</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">{selectedUser.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
