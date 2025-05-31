import React, { useContext } from "react";
import { Button } from "@c/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@c/ui/dropdown-menu";
import {
  MessageCircleOff,
  MessageSquare,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { FetchUserContext } from "/src/Context/UserContext";
import { FetchChatContext } from "/src/Context/ChatContext";

export const Chatlist = () => {
  const { contacts, setContacts } = useContext(FetchUserContext);
  const { setSelectedUserId } = useContext(FetchChatContext);

  // Kontakte als Array (von Objekt => Array)
  const usersArray = Object.values(contacts);

  const toggleFavorite = (email) => {
    const updatedContacts = {
      ...contacts,
      [email]: {
        ...contacts[email],
        fav: !contacts[email]?.fav,
      },
    };

    setContacts(updatedContacts);
  };

  const favorites = usersArray.filter((u) => u.fav);
  const chats = usersArray.filter((u) => !u.fav);

  const renderUser = (user) => (
    <div
      key={user.id}
      className="flex justify-between items-center p-1"
      onClick={() => setSelectedUserId(user.id)}
    >
      <div className="w-full flex items-center justify-between">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="w-full px-1">
          <div className="flex justify-between items-center">
            <div className="flex justify-between w-1/2">
              {user.name}
              <span
                className={user.isLoggedIn ? "text-green-400" : "text-red-400"}
              >
                {user.isLoggedIn ? "on" : "off"}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-fit w-fit">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div
                  onClick={() => toggleFavorite(user.id)}
                  className="p-1 text-xs rounded-xs flex gap-2 items-center cursor-pointer hover:bg-gray-200"
                >
                  <Star size={20} />
                  {user.fav ? "Unfavorite" : "Favorite"}
                </div>
                <DropdownMenuSeparator />
                <div className="p-1 text-xs rounded-xs flex gap-2 items-center cursor-pointer hover:bg-gray-200">
                  <MessageCircleOff size={20} />
                  Mute
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Favoriten */}
      <div className="flex flex-col">
        <div className="flex items-center p-2 font-semibold">
          <Star size={20} className="mr-3" />
          Favorites
        </div>
        <span className="w-full border-t" />
        {favorites.map(renderUser)}
        <span className="w-full border-t" />
      </div>

      {/* Chats */}
      <div className="flex flex-col">
        <div className="flex items-center p-2 font-semibold">
          <MessageSquare size={20} className="mr-3" />
          Chat
        </div>
        <span className="w-full border-t" />
        {chats.map(renderUser)}
      </div>
    </div>
  );
};
