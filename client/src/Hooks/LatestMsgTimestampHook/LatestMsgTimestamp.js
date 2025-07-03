import { useState } from "react";

export function useLatestMessageTracker() {
  const [latestMessage, setLatestMessage] = useState({});

  const track = (message, selectedUserId) => {
    const latestSender =
      message.to === selectedUserId ? message.from : message.to;
    setLatestMessage((prev) => ({
      ...prev,
      [latestSender]: message.timeStamp,
    }));
  };

  return { latestMessage, track };
}
