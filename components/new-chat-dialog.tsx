"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { collection, query, where } from "@firebase/firestore";
import firebase from "@/lib/firebase";
import { userConverter } from "@/lib/user";
import { useCollectionData } from "react-firebase-hooks/firestore";
import AvatarListItem from "@/components/avatar-list-item";
import { addChat } from "@/lib/chat";
import { User } from "@firebase/auth";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const NewChatDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}) => {
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email);
  const [recipients] = useCollectionData(
    debouncedEmail.trim() !== ""
      ? query(
          collection(firebase.firestore, "users").withConverter(userConverter),
          where("email", "==", debouncedEmail),
        )
      : null,
  );
  const filteredRecipients = recipients?.filter(
    (recipient) => recipient.id !== user.uid,
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0">
        <div
          className={cn(
            "px-6 pt-6",
            (filteredRecipients === undefined ||
              filteredRecipients.length === 0) &&
              "pb-6",
          )}
        >
          <DialogHeader>
            <DialogTitle>New chat</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Recipient email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-6"
            type="email"
          />
        </div>
        {filteredRecipients !== undefined && filteredRecipients.length > 0 && (
          <div className="p-4">
            {filteredRecipients.map((recipient) => (
              <AvatarListItem
                key={recipient.id}
                displayName={recipient.displayName}
                email={recipient.email}
                photoURL={recipient.photoURL}
                onClick={() => {
                  void addChat(user, recipient);
                  onOpenChange(false);
                }}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
