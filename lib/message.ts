import { FieldValue, FirestoreDataConverter } from "@firebase/firestore";

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: FieldValue;
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
});

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message) => ({
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      content: data.content,
      sender: data.sender,
      timestamp: data.timestamp,
    };
  },
};

export type { Message };
export { message, messageConverter };
