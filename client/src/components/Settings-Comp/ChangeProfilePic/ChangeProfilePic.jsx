import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

axios.defaults.withCredentials = true; // damit erlaube ich das senden von cookies

const SaveNewImgApi = import.meta.env.VITE_API_SAVENEWIMG;

export const ChangeProfilePic = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
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

  const handleSaveImage = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const newImage = await axios.post(SaveNewImgApi, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (newImage) {
        toast("Saved New Profile-Image");
      }
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error with save of new Image", err);
      toast("save was not possible", err);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] lg:w-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <button className="absolute right-0 top-0 p-2">
            <X onClick={onClose} />
          </button>

          <div className="flex flex-col items-center m-2">
            <p className="mb-3 text-md text-center lg:text-2xl">
              Change Profile Picture
            </p>

            {previewUrl && (
              <div className="flex gap-2 relative w-fit">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-50 h-50 rounded-full object-fill"
                />
                <button
                  onClick={handleRemoveFile}
                  className="cursor-pointer absolute -top-1 -right-2 bg-gray-400 rounded-full p-1 hover:bg-gray-600"
                  aria-label="Remove selected file"
                  type="button"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            )}
          </div>
          <Input
            type="file"
            name="avatar"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          ></Input>
          <div className="flex items-center justify-center">
            <Button
              className={`cursor-pointer ${previewUrl ? "hidden" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              Select a Image
            </Button>
            <Button
              className={`cursor-pointer ${previewUrl ? "" : "hidden"}`}
              onClick={handleSaveImage}
            >
              Save
            </Button>
          </div>
        </Card>
      </motion.div>
    </>
  );
};
