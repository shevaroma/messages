import { collection, getDocs } from "@firebase/firestore";
import firebase from "@/lib/firebase";

export const fetchUsers = async () => {
  const usersRef = collection(firebase.firestore, "users");
  const usersSnapshot = await getDocs(usersRef);
  return usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
    };
  });
};
