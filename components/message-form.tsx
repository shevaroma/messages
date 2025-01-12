import { Button } from "@/components/ui/button";
import { Check, Paperclip, SendHorizonal, Sparkles, X } from "lucide-react";
import React from "react";
import FileChip from "@/components/file-chip";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

const MessageForm = ({
  message,
  onMessageChange,
  isEditing,
  onCancelEdit,
  isEditedMessageChanged,
  file,
  onFileChange,
  fileUploaded,
  onSend,
  suggestions,
}: {
  message: string;
  onMessageChange: (message: string) => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  isEditedMessageChanged: boolean;
  file?: File;
  onFileChange: (file?: File) => void;
  fileUploaded: boolean;
  onSend: () => void;
  suggestions: string[];
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const sendingEnabled =
    (message.trim().length > 0 || (file !== undefined && fileUploaded)) &&
    (!isEditing || (isEditedMessageChanged && message.trim().length > 0));
  return (
    <>
      <div className="flex flex-col sticky bottom-0 bg-background p-4 border-t z-10">
        {suggestions.length !== 0 && (
          <div className="flex gap-2 mb-4 items-center">
            <Sparkles className="size-4 mr-2" />
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="inline-block border hover:bg-accent text-sm px-4 rounded-full h-9 transition-colors"
                onClick={() => {
                  onMessageChange(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {isEditing && (
          <div className="pl-4 pr-2 h-11 w-full bg-accent rounded-t-xl rounded-b mb-2 text-sm flex items-center justify-between">
            Editing
            <button
              className="size-7 text-foreground transition-colors flex items-center justify-center"
              onClick={onCancelEdit}
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div
          className={cn(
            "border w-full items-end flex flex-col",
            isEditing ? "rounded-t rounded-b-xl" : "rounded-xl",
          )}
        >
          <TextareaAutosize
            placeholder="Message"
            className="text-sm px-4 pt-4 w-full outline-none resize-none bg-transparent"
            value={message}
            maxRows={5}
            onChange={(event) => {
              onMessageChange(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && sendingEnabled) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <div className="flex w-full justify-between p-4 items-end">
            {file ? (
              <FileChip
                file={file}
                uploaded={fileUploaded}
                onRemove={() => {
                  onFileChange(undefined);
                  if (fileInputRef.current !== null) {
                    fileInputRef.current.value = "";
                  }
                }}
              />
            ) : (
              <Button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                disabled={isEditing}
                type="button"
                size="icon"
                variant="ghost"
                className="bg-transparent size-8 -ml-1 -mb-1"
              >
                <Paperclip />
              </Button>
            )}
            <Button
              type="submit"
              disabled={!sendingEnabled}
              size="icon"
              onClick={onSend}
              className="size-9 rounded-full"
            >
              {isEditing ? <Check /> : <SendHorizonal />}
            </Button>
          </div>
        </div>
      </div>
      <input
        type="file"
        onChange={(event) => {
          if (event.target.files !== null) onFileChange(event.target.files[0]);
        }}
        className="hidden"
        ref={fileInputRef}
      />
    </>
  );
};

export default MessageForm;
