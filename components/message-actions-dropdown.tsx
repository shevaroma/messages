import { Button } from "@/components/ui/button";
import { Ellipsis, Forward, Pencil, Reply, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropdownMenuProps = {
  onReply: () => void;
  onForward: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const MessageActionsDropdown = ({
  onReply,
  onForward,
  onEdit,
  onDelete,
}: DropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onReply}>
            <Reply className="mr-2" />
            <span>Reply</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onForward}>
            <Forward className="mr-2" />
            <span>Forward</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash className="mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActionsDropdown;
