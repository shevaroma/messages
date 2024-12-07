"use client";

import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import firebase from "@/lib/firebase";
import { message, messageConverter } from "@/lib/message";
import { cn } from "@/lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCheck,
  Paperclip,
  SendHorizonal,
  Smile,
  SwatchBook,
  X,
} from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { chatConverter } from "@/lib/chat";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOnScreen from "@/hooks/use-on-screen";
import MessageActionsDropdown from "@/components/message-actions-dropdown";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
const themes: {
  [key: string]: {
    label: string;
    className: string;
    background: React.CSSProperties;
  };
} = {
  neutral: {
    label: "Neutral",
    className: "bg-zinc-900 dark:bg-zinc-700",
    background: {
      backgroundColor: "",
      backgroundImage: "",
    },
  },
  blue: {
    label: "Blue",
    className: "bg-blue-600",
    background: {
      backgroundColor: "#d1dbf7",
      backgroundImage:
        "radial-gradient(#1d4ed8 0.5px, transparent 0.5px), radial-gradient(#1d4ed8 0.5px, #d1dbf7 0.5px)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 10px 10px",
    },
  },
  green: {
    label: "Green",
    className: "bg-green-600",
    background: {
      backgroundColor: "#daede3",
      backgroundImage:
        "radial-gradient(#047857 0.5px, transparent 0.5px), radial-gradient(#047857 0.5px, #daede3 0.5px)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 10px 10px",
    },
  },
  rose: {
    label: "Rose",
    className: "bg-rose-600",
    background: {
      backgroundColor: "#fcd8de",
      backgroundImage:
        "radial-gradient(#be123c 0.5px, transparent 0.5px), radial-gradient(#be123c 0.5px, #fcd8de 0.5px)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 10px 10px",
    },
  },
  violet: {
    label: "Violet",
    className: "bg-violet-600",
    background: {
      backgroundColor: "#e1d4f7",
      backgroundImage:
        "radial-gradient(#6d28d9 0.5px, transparent 0.5px), radial-gradient(#6d28d9 0.5px, #e1d4f7 0.5px)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 10px 10px",
    },
  },
};

const Bubble = ({
  sent,
  reaction,
  onReactionClick,
  onEditClick,
  onDeleteClick,
  theme,
  className = undefined,
  children,
  read,
  markAsRead,
  time,
  editedTime,
}: {
  sent: boolean;
  reaction?: string;
  onReactionClick: (reaction: string) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  theme: { label: string; className: string };
  className?: string;
  children: ReactNode;
  read?: boolean;
  markAsRead: () => void;
  time: string;
  editedTime?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref);
  useEffect(() => {
    if (isOnScreen && !sent) markAsRead();
  }, [isOnScreen, sent]);
  return (
    <div
      className={cn("flex group gap-2", !sent && "flex-row-reverse", className)}
      ref={ref}
    >
      {sent ? (
        <Button
          variant="ghost"
          className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center self-center"
        >
          <MessageActionsDropdown
            // onReply={onReplyClick}
            // onForward={onForwardClick}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
          />
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger
            asChild
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button variant="ghost" className="h-9 w-9">
              <Smile />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-1 rounded-xl">
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
                  onReactionClick(buttonReaction);
                }}
              >
                {buttonReaction}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      )}
      <div className="flex flex-col">
        <div
          className={cn(
            "py-2 px-3 rounded-md text-sm flex flex-col",
            sent
              ? cn("text-white rounded-br-none", theme.className)
              : theme.label === "Neutral"
                ? "bg-zinc-100 rounded-bl-none dark:bg-zinc-800 dark:text-white"
                : "bg-white rounded-bl-none dark:bg-zinc-800 dark:text-white",
          )}
        >
          <div className="text-justify mb-1">{children}</div>
          {sent && (
            <div className="flex self-end items-center">
              <span className="text-xs text-white-500 text-[9.5px]">
                {" "}
                {editedTime ? `edited (${editedTime})` : time}
              </span>
              {read ? (
                <CheckCheck className="h-2.5 w-2.5 text-white-500 ml-1" />
              ) : (
                <Check className="h-2.5 w-2.5 text-white-500 ml-1" />
              )}
            </div>
          )}
        </div>
        {reaction !== undefined && (
          <div
            className={cn(
              "shadow-md -mt-2 bg-background text-sm p-[0.125rem] rounded-full aspect-square flex items-center justify-center",
              sent ? "self-start" : "self-end",
            )}
          >
            {reaction}
          </div>
        )}
      </div>
    </div>
  );
};

const messageFormSchema = z.object({
  message: z.string().min(1),
});

const MessageForm = ({
  form,
  onSubmit,
  isEditing,
  onCancelEdit,
  className = undefined,
}: {
  form: UseFormReturn<z.infer<typeof messageFormSchema>>;
  onSubmit: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  className?: string;
}) => (
  <Form {...form}>
    <form onSubmit={onSubmit} className={cn("flex gap-4 items-end", className)}>
      <Button disabled type="button" size="icon" variant="outline">
        <Paperclip />
      </Button>
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormControl>
              <Textarea
                placeholder="Message"
                className="resize-none focus-visible:ring-transparent"
                {...field}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex flex-col items-center gap-2">
        {isEditing && form.watch("message") && (
          <Button onClick={onCancelEdit} size="icon" variant="secondary">
            <X />
          </Button>
        )}
        <Button type="submit" disabled={!form.formState.isValid} size="icon">
          <SendHorizonal />
        </Button>
      </div>
    </form>
  </Form>
);

const ChatPageContent = ({ chatID }: { chatID: string }) => {
  const [user] = useAuthState(firebase.auth);
  const chatCollectionReference = collection(firebase.firestore, "chats");
  const chatReference = doc(chatCollectionReference, chatID);
  const [chat] = useDocumentData(chatReference.withConverter(chatConverter));
  const messageReference = collection(
    firebase.firestore,
    "chats",
    chatID,
    "messages",
  ).withConverter(messageConverter);
  const [messages] = useCollectionData(
    query(messageReference, orderBy("timestamp")),
  );
  const messageForm = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { message: "" },
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, setEditingMessageId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToLatestMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [messages]);

  const handleReaction = async (messageId: string, emoji: string) => {
    if (user == null) return;
    const messageDoc = doc(messageReference, messageId);
    // fetch the message
    const messageSnapshot = await getDoc(messageDoc);
    if (!messageSnapshot.exists()) return;
    const messageData = messageSnapshot.data();
    if (messageData == null) return;
    await updateDoc(messageDoc, {
      reaction: messageData.reaction !== emoji ? emoji : deleteField(),
    });
  };

  const handleEditClick = (messageId: string, currentValue: string) => {
    setEditingMessage({ id: messageId, content: currentValue });
    messageForm.setValue("message", currentValue);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    messageForm.reset();
  };

  const handleSubmit = messageForm.handleSubmit(async (values) => {
    if (user == null) return;
    if (editingMessage) {
      const messageDoc = doc(messageReference, editingMessage.id);
      await updateDoc(messageDoc, {
        content: values.message,
        editedTime: new Date()
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase(),
      });
      setEditingMessage(null);
    } else {
      void addDoc(
        messageReference,
        message(
          values.message,
          user.uid,
          serverTimestamp(),
          new Date()
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toUpperCase(),
        ),
      );
    }
    messageForm.reset();
  });

  const handleDeleteClick = async (messageId: string) => {
    if (user == null) return;
    const messageDoc = doc(messageReference, messageId);
    await deleteDoc(messageDoc);
  };

  const setTheme = async (theme: string) => {
    await updateDoc(chatReference, {
      theme: theme,
    });
  };

  return (
    <>
      <div
        className="w-full flex flex-col"
        style={chat ? themes[chat.theme].background : {}}
      >
        <Header
          className="sticky top-0"
          trailingButtons={
            <Button
              size="icon"
              variant="ghost"
              className="-mr-3"
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <SwatchBook />
            </Button>
          }
        >
          {chatID}
        </Header>
        <div className="flex flex-grow flex-col gap-2 p-4">
          {user != null &&
            chat !== undefined &&
            messages?.map((message) => {
              const sent = message.sender === user.uid;
              return (
                <Bubble
                  key={message.id}
                  reaction={message.reaction}
                  onReactionClick={(reaction) => {
                    void handleReaction(message.id, reaction);
                  }}
                  onEditClick={() =>
                    handleEditClick(message.id, message.content)
                  }
                  onDeleteClick={() => handleDeleteClick(message.id)}
                  sent={sent}
                  className={cn(
                    "max-w-[calc(50%_-_0.5rem)]",
                    sent ? "self-end" : "self-start",
                  )}
                  theme={themes[chat.theme]}
                  read={message.read}
                  markAsRead={async () => {
                    const messageDoc = doc(messageReference, message.id);
                    await updateDoc(messageDoc, {
                      read: true,
                    });
                  }}
                  time={message.time}
                  editedTime={message.editedTime}
                >
                  {message.content}
                </Bubble>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
        <MessageForm
          form={messageForm}
          onSubmit={handleSubmit}
          isEditing={editingMessage !== null}
          onCancelEdit={handleCancelEdit}
          className="sticky bottom-0 p-4 border-t bg-background"
        />
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customise chat appearance</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="dark-mode" className="font-medium">
                  Chat theme
                </Label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Visible to you and recipient
                </span>
              </div>
              {chat !== undefined && (
                <Select value={chat.theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>{themes[chat.theme].label}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.keys(themes).map((key) => (
                        <SelectItem key={key} value={key}>
                          {themes[key].label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatPageContent;
