import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { DocumentReference, updateDoc } from "@firebase/firestore";
import AvatarWithFallback from "@/components/avatar-with-fallback";
import Header from "@/components/header";
import React from "react";
import themes from "@/app/themes";
import { Chat } from "@/lib/chat";

const ChatPageHeader = ({
  theme,
  chatReference,
  recipientDisplayName,
  recipientPhotoURL,
  recipientEmail,
}: {
  theme: string;
  chatReference: DocumentReference<Chat>;
  recipientDisplayName: string;
  recipientPhotoURL: string;
  recipientEmail: string;
}) => (
  <Header
    className="sticky top-0 z-20"
    trailingButtons={
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="-mr-3">
            <Palette />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          collisionPadding={{
            right: parseFloat(
              getComputedStyle(document.documentElement).fontSize,
            ),
          }}
        >
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          {Object.keys(themes).map((key) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={theme === key}
              onCheckedChange={() => {
                void updateDoc(chatReference, { theme: key });
              }}
            >
              {themes[key].name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    }
  >
    <div className="flex items-center gap-3">
      <AvatarWithFallback
        displayName={recipientDisplayName}
        photoURL={recipientPhotoURL}
      />
      <div>
        <span className="font-semibold block">{recipientDisplayName}</span>
        <span className="block text-xs text-muted-foreground">
          {recipientEmail}
        </span>
      </div>
    </div>
  </Header>
);

export default ChatPageHeader;
