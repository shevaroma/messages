"use client";

import { doc, updateDoc } from "@firebase/firestore";
import React, { useState } from "react";
import MessageForm from "@/components/message-form";
import useChatPageData from "@/hooks/use-chat-page-data";
import ForwardDialog from "@/components/forward-dialog";
import {
  addMessage,
  Message,
  updateMessageContent,
  updateMessageReaction,
} from "@/lib/message";
import ChatPageHeader from "@/components/chat-page-header";
import useFile from "@/hooks/use-file";
import useSuggestions from "@/hooks/use-suggestions";
import { MessageSquare } from "lucide-react";
import MessageList from "@/components/message-list";

const ChatPageContent = ({ chatID }: { chatID: string }) => {
  const data = useChatPageData(chatID);
  const [message, setMessage] = useState("");
  const [editedMessageID, setEditedMessageID] = useState<string | null>(null);
  const [previousEditedMessageContent, setPreviousEditedMessageContent] =
    useState<string | null>(null);
  const [forwardDialogState, setForwardDialogState] = useState<{
    open: boolean;
    message: Message | null;
  }>({
    open: false,
    message: null,
  });
  const { file, setFile, fileDownloadURL } = useFile(chatID);
  const suggestions = useSuggestions(data?.messages, data?.user);
  if (data === null) return;
  return (
    <>
      <div className="w-full flex flex-col h-screen">
        <ChatPageHeader
          theme={data.chat.theme}
          chatReference={data.chatReference}
          recipientDisplayName={data.recipientDisplayName}
          recipientPhotoURL={data.recipientPhotoURL}
          recipientEmail={data.recipientEmail}
        />
        {data.messages.length > 0 ? (
          <MessageList
            messages={data.messages}
            user={data.user}
            onRead={(message) => {
              const messageDoc = doc(
                data.messageCollectionReference,
                message.id,
              );
              void updateDoc(messageDoc, { read: true });
            }}
            theme={data.chat.theme}
            onForward={(message) => {
              setForwardDialogState({
                open: true,
                message: message,
              });
            }}
            onEdit={(message) => {
              if (message.content === undefined) return;
              setEditedMessageID(message.id);
              setPreviousEditedMessageContent(message.content);
              setMessage(message.content);
              setFile(undefined);
            }}
            onReact={(message, reaction) => {
              void updateMessageReaction(message.id, chatID, reaction);
            }}
          />
        ) : (
          <div className="flex flex-grow flex-col gap-2 w-full items-center justify-center text-sm text-muted-foreground">
            <MessageSquare />
            No messages yet
          </div>
        )}
        <MessageForm
          message={message}
          onMessageChange={setMessage}
          isEditing={editedMessageID !== null}
          onCancelEdit={() => {
            setEditedMessageID(null);
            setPreviousEditedMessageContent(null);
            setMessage("");
          }}
          isEditedMessageChanged={
            message.trim() !== previousEditedMessageContent
          }
          file={file}
          onFileChange={setFile}
          fileUploaded={fileDownloadURL !== undefined}
          onSend={() => {
            const trimmed = message.trim();
            if (editedMessageID !== null) {
              void updateMessageContent(editedMessageID, chatID, trimmed);
            } else {
              void addMessage(
                chatID,
                trimmed.length === 0 ? undefined : trimmed,
                data.user,
                false,
                file?.name,
                fileDownloadURL,
              );
              setMessage("");
              setFile(undefined);
            }
            setEditedMessageID(null);
            setPreviousEditedMessageContent(null);
            setMessage("");
          }}
          suggestions={suggestions}
        />
      </div>
      <ForwardDialog
        open={forwardDialogState.open}
        onOpenChange={(open) => {
          setForwardDialogState((previous) => ({
            open: open,
            message: previous.message,
          }));
        }}
        user={data.user}
        onForward={(chatID) => {
          if (forwardDialogState.message === null) return;
          void addMessage(
            chatID,
            forwardDialogState.message.content,
            data.user,
            true,
            forwardDialogState.message.fileName,
            forwardDialogState.message.fileDownloadURL,
          );
          setForwardDialogState((previous) => ({
            open: false,
            message: previous.message,
          }));
        }}
      />
    </>
  );
};

export default ChatPageContent;
