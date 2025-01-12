import {
  addDoc,
  collection,
  FirestoreDataConverter,
  getDocs,
  query,
  where,
  writeBatch,
} from "@firebase/firestore";
import { User as FirebaseUser } from "@firebase/auth";
import { User } from "@/lib/user";
import firebase from "@/lib/firebase";

type Chat = {
  id: string;
  memberUIDs: string[];
  memberDisplayNames: string[];
  memberPhotoURLs: string[];
  memberEmails: string[];
  theme: string;
};

const chat = (
  memberUIDs: string[],
  memberDisplayNames: string[],
  memberPhotoURLs: string[],
  memberEmails: string[],
): Chat => ({
  id: "",
  memberUIDs,
  memberDisplayNames,
  memberPhotoURLs,
  memberEmails,
  theme: "neutral",
});

const chatConverter: FirestoreDataConverter<Chat> = {
  toFirestore: (chat) => ({
    memberUIDs: chat.memberUIDs,
    memberDisplayNames: chat.memberDisplayNames,
    memberPhotoURLs: chat.memberPhotoURLs,
    memberEmails: chat.memberEmails,
    theme: chat.theme,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      memberUIDs: data.memberUIDs,
      memberDisplayNames: data.memberDisplayNames,
      memberPhotoURLs: data.memberPhotoURLs,
      memberEmails: data.memberEmails,
      theme: data.theme,
    };
  },
};

const addChat = async (user: FirebaseUser, recipient: User) => {
  const chatCollectionReference = collection(
    firebase.firestore,
    "chats",
  ).withConverter(chatConverter);
  const existingChats = await getDocs(
    query(
      chatCollectionReference,
      where("memberUIDs", "array-contains", user.uid),
    ),
  );
  const existingChat = existingChats.docs[0];
  if (existingChat !== undefined) return existingChat.id;
  const newChat = await addDoc(
    chatCollectionReference,
    chat(
      [user.uid, recipient.id],
      [user.displayName ?? "", recipient.displayName],
      [user.photoURL ?? "", recipient.photoURL],
      [user.email ?? "", recipient.email],
    ),
  );
  return newChat.id;
};

const updateChats = async (user: FirebaseUser) => {
  const chatCollectionReference = collection(
    firebase.firestore,
    "chats",
  ).withConverter(chatConverter);
  const chats = await getDocs(
    query(
      chatCollectionReference,
      where("memberUIDs", "array-contains", user.uid),
    ),
  );
  if (chats.empty) return;
  const batch = writeBatch(firebase.firestore);
  chats.forEach((snapshot) => {
    const data = snapshot.data();
    const userIndex = data.memberUIDs.indexOf(user.uid);
    const memberDisplayNames = [...data.memberDisplayNames];
    const memberEmails = [...data.memberEmails];
    const memberPhotoURLs = [...data.memberPhotoURLs];
    memberDisplayNames[userIndex] = user.displayName || "";
    memberEmails[userIndex] = user.email ?? "";
    memberPhotoURLs[userIndex] = user.photoURL ?? "";
    batch.update(snapshot.ref, {
      memberDisplayNames: memberDisplayNames,
      memberEmails: memberEmails,
      memberPhotoURLs: memberPhotoURLs,
    });
  });
  await batch.commit();
};

export type { Chat };
export { chatConverter, chat, addChat, updateChats };
