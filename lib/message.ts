import { FieldValue, FirestoreDataConverter } from "@firebase/firestore";

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: FieldValue;
  reaction?: string;
};

const message = (
  content: string,
  sender: string,
  timestamp: FieldValue,
): Message => ({
  id: "",
  content,
  sender,
  timestamp,
  reaction: undefined,
});

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message) => {
    const data: any = {
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
    };
    if (message.reaction !== undefined) data.reaction = message.reaction;
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
    };
  },
};

export type { Message };
export { message, messageConverter };
