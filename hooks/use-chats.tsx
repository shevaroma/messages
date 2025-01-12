import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "@firebase/firestore";
import firebase from "@/lib/firebase";
import { chatConverter } from "@/lib/chat";
import { User } from "@firebase/auth";

const useChats = (user: User | null | undefined) => {
  const [chats] = useCollectionData(
    user != null
      ? query(
          collection(firebase.firestore, "chats").withConverter(chatConverter),
          where("memberUIDs", "array-contains", user.uid),
        )
      : null,
  );
  if (user == null) return undefined;
  return chats?.map((chat) => {
    const recipientIndex = chat.memberUIDs.findIndex((uid) => uid != user.uid);
    return {
      ...chat,
      recipientDisplayName: chat.memberDisplayNames[recipientIndex],
      recipientPhotoURL: chat.memberPhotoURLs[recipientIndex],
      recipientEmail: chat.memberEmails[recipientIndex],
    };
  });
};

export default useChats;
