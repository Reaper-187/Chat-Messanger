import React, { useRef, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Image, Laugh, MapPin, Paperclip, Send, X } from "lucide-react";
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
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

const SendIMG = import.meta.env.VITE_API_SENDIMG;
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
      toast("Geolocation is not supported by your Browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setMessageText(mapsLink);
      },
      (error) => {
        console.error("Error with Locationaccess:", error);
        toast("Postion can not be found.");
      }
    );
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSendMessage = async () => {
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

    if (selectedFile) {
      const imgUpload = new FormData();
      imgUpload.append("userImg", selectedFile);
      const newUserImg = await axios.post(SendIMG, imgUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const resImgUrl = newUserImg.data.url;
      newMessage.mediaUrl = resImgUrl;
    }

    socket.emit("send_message", newMessage, fetchSortContacts);
    setCurrentChatMessages((prev) => [...prev, newMessage]);
    fetchSortContacts();
    setMessageText("");
    handleRemoveFile();
  };

  const [openPicker, setOpenPicker] = useState(false);
  const openEmojiPicker = () => {
    setOpenPicker((prev) => !prev);
  };

  return (
    <div className="pt-1 w-full">
      {previewUrl && (
        <div className="flex items-center mb-2 gap-3 relative w-fit">
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
        name="userImg"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="relative w-full">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(messageText)}
          onFocus={() => setOpenPicker(false)}
          placeholder="Enter message"
          className="pr-20"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Laugh
            size={20}
            onClick={openEmojiPicker}
            className="cursor-pointer"
          />

          <EmojiPicker
            className={`h-[250px] rounded-lg border shadow-md absolute right-0 bottom-10 lg:right30 ${
              openPicker ? "" : "hidden"
            }`}
            onEmojiSelect={({ emoji }) => {
              setMessageText((prev) => prev + emoji);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
          </EmojiPicker>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1 h-auto w-auto">
                <Paperclip />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="flex justify-evenly">
              <Image
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <DropdownMenuSeparator />
              <MapPin
                className="cursor-pointer"
                onClick={handleShareLocation}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <Send
            size={20}
            className="cursor-pointer"
            onClick={() => handleSendMessage(messageText)}
          />
        </div>
      </div>
    </div>
  );
};
