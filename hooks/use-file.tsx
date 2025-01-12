import { useEffect, useState } from "react";
import addFile from "@/lib/files";

const useFile = (chatID: string) => {
  const [file, setFile] = useState<File>();
  const [fileDownloadURL, setFileDownloadURL] = useState<string>();
  useEffect(() => {
    setFileDownloadURL(undefined);
    if (file === undefined) return;
    (async () => {
      setFileDownloadURL(await addFile(file, chatID));
    })();
  }, [file, chatID]);
  return { file, setFile, fileDownloadURL };
};

export default useFile;
