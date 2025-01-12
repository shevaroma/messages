import AvatarWithFallback from "@/components/avatar-with-fallback";
import React from "react";

const AvatarListItem = ({
  displayName,
  email,
  photoURL,
  onClick,
}: {
  displayName: string;
  email: string;
  photoURL: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex gap-3 text-sm h-14 text-left items-center px-2 hover:bg-accent rounded-md w-full transition-colors"
  >
    <AvatarWithFallback displayName={displayName} photoURL={photoURL} />
    <div>
      <span className="font-semibold block">{displayName}</span>
      <span className="block text-xs text-muted-foreground">{email}</span>
    </div>
  </button>
);

export default AvatarListItem;
