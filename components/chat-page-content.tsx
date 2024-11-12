"use client";

import { useCollectionData } from "react-firebase-hooks/firestore";
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
import { SendHorizonal, Smile } from "lucide-react";
import { ReactNode } from "react";
import Header from "@/components/header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const Bubble = ({
  sent,
  reaction,
  onReactionClick,
  className = undefined,
  children,
}: {
  sent: boolean;
  reaction?: string;
  onReactionClick: (reaction: string) => void;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn("flex", !sent && "flex-row-reverse group gap-2", className)}
  >
    {!sent && (
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
            ? "bg-zinc-900 text-white rounded-br-none dark:bg-zinc-700"
            : "bg-zinc-100 rounded-bl-none dark:bg-zinc-800 dark:text-white",
        )}
      >
        {children}
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

  return (
    <div className="w-full flex flex-col">
      <Header className="sticky top-0">{chatID}</Header>
      <div className="flex flex-grow flex-col gap-2 p-4">
        {user != null &&
          messages?.map((message) => {
            const sent = message.sender === user.uid;
            return (
              <Bubble
                key={message.id}
                reaction={message.reaction}
                onReactionClick={(reaction) => {
                  void handleReaction(message.id, reaction);
                }}
                sent={sent}
                className={cn(
                  "max-w-[calc(50%_-_0.5rem)]",
                  sent ? "self-end" : "self-start",
                )}
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
  );
};

export default ChatPageContent;
