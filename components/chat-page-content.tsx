"use client";

import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
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
import { SendHorizonal } from "lucide-react";
import { ReactNode } from "react";
import Header from "@/components/header";

const Bubble = ({
  sent,
  className = undefined,
  children,
}: {
  sent: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "py-2 px-3 rounded-md text-sm",
      sent
        ? "bg-zinc-900 text-white rounded-br-none dark:bg-zinc-700"
        : "bg-zinc-100 rounded-bl-none dark:bg-zinc-800 dark:text-white",
      className,
    )}
  >
    {children}
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
