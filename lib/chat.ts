import { FirestoreDataConverter } from "@firebase/firestore";

type Chat = {
  id: string;
  members: string[];
};

const chatConverter: FirestoreDataConverter<Chat> = {
  toFirestore: (chat) => ({ members: chat.members }),
  fromFirestore: (snapshot, options) => ({
    id: snapshot.id,
    members: snapshot.data(options).members,
  }),
};

export type { Chat };
export { chatConverter };
