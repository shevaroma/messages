import { doc, FirestoreDataConverter, setDoc } from "@firebase/firestore";
import { User as FirebaseUser } from "@firebase/auth";
import firebase from "@/lib/firebase";

type User = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
};

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user) => ({
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
    };
  },
};

const addOrUpdateUser = async (user: FirebaseUser) => {
  await setDoc(doc(firebase.firestore, `users/${user.uid}`), {
    displayName: user.displayName,
    email: user.email || "",
    photoURL: user.photoURL || "",
  });
};

export type { User };
export { userConverter, addOrUpdateUser };
