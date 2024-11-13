"use client";

import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
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
  Pencil,
  SendHorizonal,
  Smile,
  SwatchBook,
  X,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
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

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const themes: { [key: string]: { label: string; className: string } } = {
  neutral: { label: "Neutral", className: "bg-zinc-900 dark:bg-zinc-700" },
  blue: { label: "Blue", className: "bg-blue-600" },
  green: { label: "Green", className: "bg-green-600" },
  rose: { label: "Rose", className: "bg-rose-600" },
  violet: { label: "Violet", className: "bg-violet-600" },
};

const Bubble = ({
  sent,
  reaction,
  onReactionClick,
  onEditClick,
  theme,
  className = undefined,
  children,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  editValue,
  onEditChange,
}: {
  sent: boolean;
  reaction?: string;
  onReactionClick: (reaction: string) => void;
  onEditClick: () => void;
  theme: { label: string; className: string };
  className?: string;
  children: ReactNode;
  isEditing: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  editValue: string;
  onEditChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div
    className={cn("flex group gap-2", !sent && "flex-row-reverse", className)}
  >
    {sent ? (
      <Button
        variant="ghost"
        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onEditClick}
      >
        <Pencil />
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
          "py-2 px-3 rounded-md text-sm",
          sent
            ? cn("text-white rounded-br-none", theme.className)
            : "bg-zinc-100 rounded-bl-none dark:bg-zinc-800 dark:text-white",
        )}
      >
        {isEditing ? (
          <Textarea
            value={editValue}
            onChange={onEditChange}
            className={cn(
              "resize-none focus-visible:ring-transparent p-0 border-none rounded-none ring-0",
              sent
                ? cn("text-white", theme.className)
                : "bg-zinc-100 dark:bg-zinc-800 dark:text-white",
            )}
          />
        ) : (
          children
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
      {isEditing && (
        <div className="flex gap-2 mt-2 justify-end">
          <Button onClick={onSaveEdit} className="h-9 w-9" variant="secondary">
            <Check />
          </Button>
          <Button onClick={onCancelEdit} className="h-9 w-9" variant="outline">
            <X />
          </Button>
        </div>
      )}
    </div>
  </div>
);

const messageFormSchema = z.object({
  message: z.string().min(1),
});

const MessageForm = ({
  form,
  onSubmit,
  className = undefined,
}: {
  form: UseFormReturn<z.infer<typeof messageFormSchema>>;
  onSubmit: () => void;
  className?: string;
}) => (
  <Form {...form}>
    <form onSubmit={onSubmit} className={cn("flex gap-4 items-end", className)}>
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
      <Button type="submit" disabled={!form.formState.isValid} size="icon">
        <SendHorizonal />
      </Button>
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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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
    setEditingMessageId(messageId);
    setEditValue(currentValue);
  };

  const handleSaveEdit = async () => {
    if (editingMessageId == null) return;
    const messageDoc = doc(messageReference, editingMessageId);
    await updateDoc(messageDoc, {
      content: editValue,
    });
    setEditingMessageId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditValue("");
  };

  const setTheme = async (theme: string) => {
    await updateDoc(chatReference, {
      theme: theme,
    });
  };

  return (
    <>
      <div className="w-full flex flex-col">
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
              const isEditing = editingMessageId === message.id;
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
                  sent={sent}
                  className={cn(
                    "max-w-[calc(50%_-_0.5rem)]",
                    sent ? "self-end" : "self-start",
                  )}
                  theme={themes[chat.theme]}
                  isEditing={isEditing}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  editValue={editValue}
                  onEditChange={(e) => setEditValue(e.target.value)}
                >
                  {message.content}
                </Bubble>
              );
            })}
        </div>
        <MessageForm
          form={messageForm}
          onSubmit={messageForm.handleSubmit((values) => {
            if (user == null) return;
            void addDoc(
              messageReference,
              message(values.message, user.uid, serverTimestamp()),
            );
            messageForm.reset();
          })}
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
