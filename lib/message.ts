import {
  addDoc,
  collection,
  deleteField,
  doc,
  FieldValue,
  FirestoreDataConverter,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { User } from "@firebase/auth";
import firebase from "@/lib/firebase";

type Message = {
  id: string;
  content: string | undefined;
  sender: string;
  timestamp: FieldValue;
  reaction: string | undefined;
  read: boolean;
  edited: boolean;
  forwarded: boolean;
  fileName: string | undefined;
  fileDownloadURL: string | undefined;
};

const message = (
  content: string | undefined,
  sender: string,
  timestamp: FieldValue,
  forwarded: boolean,
  fileName: string | undefined,
  fileDownloadURL: string | undefined,
): Message => ({
  id: "",
  content,
  sender,
  timestamp,
  reaction: undefined,
  read: false,
  edited: false,
  forwarded,
  fileName,
  fileDownloadURL,
});

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      sender: message.sender,
      timestamp: message.timestamp,
      read: message.read,
      edited: message.edited,
      forwarded: message.forwarded,
    };
    if (message.content !== undefined) data.content = message.content;
    if (message.reaction !== undefined) data.reaction = message.reaction;
    if (message.fileName !== undefined) data.fileName = message.fileName;
    if (message.fileDownloadURL !== undefined) {
      data.fileDownloadURL = message.fileDownloadURL;
    }
    return data;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      content: data.content,
      sender: data.sender,
      timestamp: data.timestamp,
      reaction: data.reaction,
      read: data.read,
      edited: data.edited,
      forwarded: data.forwarded,
      fileName: data.fileName,
      fileDownloadURL: data.fileDownloadURL,
    };
  },
};

const addMessage = async (
  chatID: string,
  content: string | undefined,
  sender: User,
  forwarded: boolean = false,
  fileName: string | undefined,
  fileDownloadURL: string | undefined,
) => {
  const messageCollectionReference = collection(
    firebase.firestore,
    "chats",
    chatID,
    "messages",
  ).withConverter(messageConverter);
  await addDoc(
    messageCollectionReference,
    message(
      content,
      sender.uid,
      serverTimestamp(),
      forwarded,
      fileName,
      fileDownloadURL,
    ),
  );
};

const updateMessageContent = async (
  id: string,
  chatID: string,
  content: string,
) => {
  const messageCollectionReference = collection(
    firebase.firestore,
    "chats",
    chatID,
    "messages",
  ).withConverter(messageConverter);
  await updateDoc(doc(messageCollectionReference, id), {
    content: content,
    edited: true,
  });
};

const updateMessageReaction = async (
  id: string,
  chatID: string,
  reaction: string | undefined,
) => {
  const messageCollectionReference = collection(
    firebase.firestore,
    "chats",
    chatID,
    "messages",
  ).withConverter(messageConverter);
  await updateDoc(doc(messageCollectionReference, id), {
    reaction: reaction ?? deleteField(),
  });
};

export type { Message };
export {
  message,
  messageConverter,
  addMessage,
  updateMessageContent,
  updateMessageReaction,
};
