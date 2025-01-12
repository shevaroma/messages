import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@firebase/auth";
import useChats from "@/hooks/use-chats";
import React from "react";
import AvatarListItem from "@/components/avatar-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";

const ForwardDialog = ({
  open,
  onOpenChange,
  user,
  onForward,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onForward: (chatID: string) => void;
}) => {
  const chats = useChats(user);
  if (chats === undefined) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0">
        <DialogTitle className="p-6 border-b">Forward</DialogTitle>
        <ScrollArea className="px-4 max-h-[min(calc(100vh_-_5.625rem),_24rem)]">
          <div className="h-4" />
          {chats.map((chat) => (
            <AvatarListItem
              key={chat.id}
              displayName={chat.recipientDisplayName}
              email={chat.recipientEmail}
              photoURL={chat.recipientPhotoURL}
              onClick={() => {
                onForward(chat.id);
              }}
            />
          ))}
          <div className="h-4" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardDialog;
