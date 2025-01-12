import { File, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FileChip = ({
  file,
  uploaded,
  onRemove,
  className = undefined,
}: {
  file: File;
  uploaded: boolean;
  onRemove: () => void;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center bg-accent rounded-full pl-3 pr-[0.325rem] h-9",
        className,
      )}
    >
      {uploaded ? (
        <File className="size-4" />
      ) : (
        <Loader2 className="size-4 animate-spin" />
      )}
      <span className="ml-3 block text-sm">{file.name}</span>
      <Button
        size="icon"
        variant="ghost"
        className="size-6 hover:bg-zinc-200 dark:hover:bg-zinc-600 ml-2 rounded-full"
        onClick={onRemove}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};

export default FileChip;
