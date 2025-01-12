import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/lib/message";
import { User } from "@firebase/auth";
import Bubble from "@/components/bubble";
import themes from "@/app/themes";
import { useEffect, useRef } from "react";

const MessageList = ({
  messages,
  user,
  onRead,
  theme,
  onForward,
  onEdit,
  onReact,
}: {
  messages: Message[];
  user: User;
  onRead: (message: Message) => void;
  theme: string;
  onForward: (message: Message) => void;
  onEdit: (message: Message) => void;
  onReact: (message: Message, reaction?: string) => void;
}) => {
  const viewport = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef(messages.length);
  const isAtBottom = useRef<boolean>(true);
  const blockScrollListener = useRef<boolean>(false);
  useEffect(() => {
    if (viewport.current === null) return;
    if (messages.length > previousMessageCount.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
    previousMessageCount.current = messages.length;
  }, [messages.length]);
  useEffect(() => {
    const element = viewport.current;
    if (element === null) return;
    element.scrollTop = element.scrollHeight;
    const onScroll = () => {
      if (blockScrollListener.current) {
        blockScrollListener.current = false;
        return;
      }
      isAtBottom.current =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
    };
    const resizeObserver = new ResizeObserver(() => {
      if (!isAtBottom.current) return;
      blockScrollListener.current = true;
      element.scrollTop = element.scrollHeight;
    });
    element.addEventListener("scroll", onScroll);
    resizeObserver.observe(element);
    return () => {
      element.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [viewport]);
  return (
    <ScrollArea className="flex-grow" viewportRef={viewport}>
      <div className="flex flex-col gap-2 p-4">
        {messages.map((message) => {
          const sent = message.sender === user.uid;
          return (
            <Bubble
              message={message}
              key={message.id}
              onReact={
                !sent
                  ? (reaction) => {
                      onReact(message, reaction);
                    }
                  : null
              }
              onEdit={
                sent && message.content !== undefined && !message.forwarded
                  ? () => {
                      if (message.content === undefined) return;
                      onEdit(message);
                    }
                  : null
              }
              onForward={() => {
                onForward(message);
              }}
              sent={sent}
              theme={themes[theme]}
              onRead={() => {
                onRead(message);
              }}
            >
              {message.content}
            </Bubble>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
