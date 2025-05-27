import React, { useState } from "react";
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

const initialUsers = [
  {
    name: "John",
    email: "jhon@gmail.com",
    fav: false,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jhon",
    isLoggedIn: false,
  },
  {
    name: "May",
    email: "maycheik@gmail.com",
    fav: false,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=May",
    isLoggedIn: true,
  },
];

export const Chatlist = ({ onSelectUser }) => {
  const [users, setUsers] = useState(initialUsers);
  const toggleFavorite = (email) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, fav: !user.fav } : user
      )
    );
  };

  const favorites = users.filter((u) => u.fav);
  const chats = users.filter((u) => !u.fav);

  const renderUser = (user) => (
    <div
      key={user.email}
      className="flex justify-between items-center p-1"
      onClick={() => onSelectUser(user)}
    >
      <div className=" w-full flex items-center justify-between">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="w-full px-1">
          <div className="flex justify-between items-center">
            <div className="flex justify-between w-1/2">
              {user.name}
              {user.isLoggedIn ? (
                <p className="text-green-400">on</p>
              ) : (
                <p className="text-red-400">off</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-fit w-fit">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div
                  onClick={() => toggleFavorite(user.email)}
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
