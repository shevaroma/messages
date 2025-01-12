import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import firebase from "@/lib/firebase";
import getUUID from "@/lib/uuid";

const addFile = async (file: File, chatID: string) => {
  const result = await uploadBytes(
    ref(firebase.storage, `files/${chatID}/${getUUID()}-${file.name}`),
    file,
  );
  return getDownloadURL(result.ref);
};

export default addFile;
