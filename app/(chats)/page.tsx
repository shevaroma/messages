import { MessageSquare } from "lucide-react";
import Header from "@/components/header";

const ChatSelectionPage = () => (
  <div className="flex flex-col w-full">
    <Header />
    <div className="flex flex-grow flex-col gap-2 w-full items-center justify-center text-sm text-muted-foreground">
      <MessageSquare />
      Select a chat
    </div>
  </div>
);

export default ChatSelectionPage;
