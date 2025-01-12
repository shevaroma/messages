import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@/lib/firebase";
import { collection, doc, orderBy, query } from "@firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { chatConverter } from "@/lib/chat";
import { messageConverter } from "@/lib/message";

const useChatPageData = (chatID: string) => {
  const [user] = useAuthState(firebase.auth);
  const chatCollectionReference = collection(
    firebase.firestore,
    "chats",
  ).withConverter(chatConverter);
  const chatReference = doc(chatCollectionReference, chatID);
  const [chat] = useDocumentData(chatReference);
  const recipientIndex =
    chat !== undefined && user != null
      ? chat.memberUIDs.findIndex((uid) => uid != user.uid)
      : null;
  const recipientDisplayName =
    chat !== undefined && recipientIndex !== null
      ? chat.memberDisplayNames[recipientIndex]
      : null;
  const recipientPhotoURL =
    chat !== undefined && recipientIndex !== null
      ? chat.memberPhotoURLs[recipientIndex]
      : null;
  const recipientEmail =
    chat !== undefined && recipientIndex !== null
      ? chat.memberEmails[recipientIndex]
      : null;
  const messageCollectionReference = collection(
    firebase.firestore,
    "chats",
    chatID,
    "messages",
  ).withConverter(messageConverter);
  const [messages] = useCollectionData(
    query(messageCollectionReference, orderBy("timestamp")),
  );
  if (
    chat === undefined ||
    user == null ||
    messages === undefined ||
    recipientDisplayName == null ||
    recipientPhotoURL == null ||
    recipientEmail == null
  ) {
    return null;
  }
  return {
    user,
    chat,
    chatReference,
    messages,
    messageCollectionReference,
    recipientDisplayName,
    recipientPhotoURL,
    recipientEmail,
  };
};

export default useChatPageData;
