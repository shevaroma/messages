import { useEffect, useState } from "react";
import getSuggestions from "@/lib/suggestions";
import { Message } from "@/lib/message";
import { User } from "@firebase/auth";

const useSuggestions = (messages?: Message[], user?: User) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const lastMessage =
    messages !== undefined && messages.length > 0
      ? messages[messages.length - 1]
      : null;
  useEffect(() => {
    if (user?.uid === undefined || lastMessage?.sender === undefined) return;
    (async () => {
      if (
        lastMessage.sender === user.uid ||
        lastMessage.content === undefined
      ) {
        setSuggestions([]);
      } else {
        setSuggestions(await getSuggestions(lastMessage.content));
      }
    })();
  }, [user?.uid, lastMessage?.sender, lastMessage?.content]);
  return suggestions;
};

export default useSuggestions;
