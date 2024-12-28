"use client";

import { Button } from "@/components/ui/button";
import { onAuthStateChanged, signInWithPopup } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import firebase from "@/lib/firebase";
import GoogleIcon from "@/components/google-icon";

const { auth, firestore } = firebase;

const authListener = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(firestore, `users/${user.uid}`);
        const displayName = user.displayName || "";
        const [name, surname] = displayName.split(" ");
        await setDoc(userDocRef, {
          displayName: `${name || ""} ${surname || ""}`.trim(),
          email: user.email || "",
          photoURL: user.photoURL || "",
        });
        console.log(`User document created/updated for user: ${user.uid}`);
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    } else {
      console.log("No user is signed in");
    }
  });
};

const SignInButton = ({ className = "" }: { className: string }) => (
  <Button
    className={className}
    onClick={() => {
      void signInWithPopup(auth, firebase.authProvider).then(() => {
        authListener();
      });
    }}
  >
    <GoogleIcon />
    Sign in with Google
  </Button>
);

export default SignInButton;
