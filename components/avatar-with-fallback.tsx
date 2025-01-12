import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AvatarWithFallback = ({
  displayName,
  photoURL,
  className = undefined,
}: {
  displayName: string;
  photoURL: string;
  className?: string;
}) => (
  <Avatar className={cn("size-8 rounded-full", className)}>
    <AvatarImage src={photoURL} alt={displayName} />
    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
  </Avatar>
);

export default AvatarWithFallback;
