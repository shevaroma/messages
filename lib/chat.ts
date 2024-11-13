import { FirestoreDataConverter } from "@firebase/firestore";

type Chat = {
  id: string;
  members: string[];
  theme: string;
};

const chatConverter: FirestoreDataConverter<Chat> = {
  toFirestore: (chat) => ({ members: chat.members, theme: chat.theme }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      members: data.members,
      theme: data.theme,
    };
  },
};

export type { Chat };
export { chatConverter };
