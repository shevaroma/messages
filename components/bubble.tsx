import React, { ReactNode, useEffect, useRef } from "react";
import useOnScreen from "@/hooks/use-on-screen";
import { cn } from "@/lib/utils";
import MessageActionsDropdown from "@/components/message-actions-dropdown";
import { Check, CheckCheck, File, Forward } from "lucide-react";
import { Message } from "@/lib/message";
import { Theme } from "@/app/themes";

const Bubble = ({
  message,
  sent,
  onReact,
  onEdit,
  onForward,
  theme,
  onRead,
  children,
}: {
  message: Message;
  sent: boolean;
  onReact: ((reaction: string | undefined) => void) | null;
  onEdit: (() => void) | null;
  onForward: () => void;
  theme: Theme;
  onRead: () => void;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref);
  useEffect(() => {
    if (isOnScreen && !sent) onRead();
  }, [isOnScreen, sent, onRead]);
  const date = message.timestamp?.toDate() ?? new Date();
  const dateString = date.toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div
      className={cn(
        "max-w-[calc(50%_+_3rem)] flex flex-col",
        sent ? "self-end" : "self-start",
      )}
    >
      <div
        className={cn(
          "flex group gap-2 relative items-center",
          !sent && "flex-row-reverse",
        )}
        ref={ref}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageActionsDropdown
            onForward={onForward}
            onEdit={onEdit}
            onReact={onReact}
            reaction={message.reaction}
          />
        </div>
        <div
          className={cn(
            "rounded-xl text-sm flex flex-col",
            sent ? "rounded-br-none" : "rounded-bl-none",
            sent ? theme.sentBubbleClassName : "bg-zinc-100 dark:bg-zinc-800",
          )}
        >
          {message.forwarded && (
            <div className="opacity-80 flex items-center gap-1 text-[0.6875rem] leading-4 mx-3 mt-2">
              <Forward className="size-4" />
              Forwarded
            </div>
          )}
          {message.fileName !== undefined && (
            <a
              href={message.fileDownloadURL}
              className="flex items-center gap-2 px-3 py-3"
              target="_blank"
            >
              <File className="size-5" />
              {message.fileName}
            </a>
          )}
          {children !== undefined && (
            <div
              className={cn(
                "mx-3 mb-1 whitespace-pre-line",
                message.fileName === undefined && "mt-2",
                message.fileName === undefined && message.forwarded && "mt-1",
              )}
            >
              {children}
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-2 opacity-80 mx-3 mb-2",
              sent ? "self-end" : "self-start",
            )}
          >
            <span className="text-[0.6875rem] leading-4">
              {dateString} {message.edited ? "(edited)" : ""}
            </span>
            {sent &&
              (message.read ? (
                <CheckCheck className="size-4 text-white-500" />
              ) : (
                <Check className="size-4 text-white-500" />
              ))}
          </div>
        </div>
      </div>
      {message.reaction !== undefined && (
        <div
          className={cn(
            "rounded-full bg-white dark:bg-zinc-700 shadow-md inline-flex items-center justify-center text-sm size-7 -mt-1.5 z-10",
            sent ? "ml-14" : "self-end mr-14",
          )}
        >
          <span>{message.reaction}</span>
        </div>
      )}
    </div>
  );
};

export default Bubble;
