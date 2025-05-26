import React from "react";
import { Input } from "@c/ui/input";
import { File, Image, MapPin, Paperclip, Send } from "lucide-react";
import { Button } from "@c/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@c/ui/dropdown-menu";

export const MessageInput = () => {
  return (
    <div className="flex justify-between items-center bg-gray-200 p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-fit w-fit">
            <Paperclip />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="flex justify-between">
          <Image className="cursor-pointer" />
          <DropdownMenuSeparator />
          <MapPin className="cursor-pointer" />
          <DropdownMenuSeparator />
          <File className="cursor-pointer" />
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        placeholder="enter Text message"
        className="mr-3 border-red-500
"
      />
      <Send className="cursor-pointer" />
    </div>
  );
};
