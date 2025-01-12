import { Button } from "@/components/ui/button";
import { Ellipsis, Forward, Pencil, Smile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const MessageActionsDropdown = ({
  onForward,
  onReact,
  reaction,
  onEdit,
}: {
  onForward: () => void;
  onReact: ((reaction: string | undefined) => void) | null;
  reaction: string | undefined;
  onEdit: (() => void) | null;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {onReact !== null && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Smile />
                React
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <div className="flex">
                    {reactions.map((buttonReaction) => (
                      <Button
                        key={buttonReaction}
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "text-base",
                          reaction === buttonReaction && "bg-accent",
                        )}
                        onClick={() => {
                          onReact(
                            buttonReaction === reaction
                              ? undefined
                              : buttonReaction,
                          );
                        }}
                      >
                        {buttonReaction}
                      </Button>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
          {onEdit !== null && (
            <DropdownMenuItem onClick={onEdit}>
              <Pencil />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onForward}>
            <Forward />
            <span>Forward</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActionsDropdown;
