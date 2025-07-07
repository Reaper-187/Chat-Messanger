import React, { useRef, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Image, MapPin, Paperclip, Send, X } from "lucide-react"; // Ich nehme an, X ist verfügbar
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FetchChatContext } from "@/Context/MessagesContext";
import { useAuth } from "@/Context/Auth-Context/Auth-Context";
import axios from "axios";
import { useSocket } from "@/Hooks/useSocket";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

export const MessageInput = () => {
  const socket = useSocket();
  const { userProfile } = useAuth();
  const { selectedUserId, setCurrentChatMessages, fetchSortContacts } =
    useContext(FetchChatContext);
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation wird von deinem Browser nicht unterstützt.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setMessage(mapsLink);
      },
      (error) => {
        console.error("Fehler beim Standortzugriff:", error);
        alert("Standort konnte nicht abgerufen werden.");
      }
    );
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSendMessage = () => {
    if (!selectedUserId) return;

    if (messageText.trim() === "" && !selectedFile) return;

    const newMessage = {
      id: uuidv4(),
      text: messageText,
      from: userProfile?._id,
      name: userProfile?.name,
      to: selectedUserId,
      timeStamp: new Date().toISOString(),
    };
    socket.emit("send_message", newMessage, fetchSortContacts);
    fetchSortContacts();
    setCurrentChatMessages((prev) => [...prev, newMessage]);
    setMessageText("");
    handleRemoveFile();
  };

  return (
    <div className="pt-1 w-full">
      {previewUrl && (
        <div className="flex items-center gap-2 relative w-fit">
          <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded" />
          <p className="text-sm text-gray-600">{selectedFile?.name}</p>
          <button
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 bg-gray-400 rounded-full p-1 hover:bg-gray-600"
            aria-label="Remove selected file"
            type="button"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-fit w-fit">
              <Paperclip />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="flex justify-evenly">
            <Image
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />
            <DropdownMenuSeparator />
            <MapPin className="cursor-pointer" onClick={handleShareLocation} />
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(messageText)}
          placeholder="enter Text message"
          className="mr-3"
        />

        <Send
          className="cursor-pointer"
          onClick={() => handleSendMessage(messageText)}
        />
      </div>
    </div>
  );
};
