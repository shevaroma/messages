"use client";

import firebase from "@/app/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [user] = useAuthState(firebase.auth);
  return user != null ? (
    <div>
      <pre>{user.uid}</pre>
      <Button
        onClick={() => {
          void signOut(firebase.auth);
        }}
      >
        Sign out
      </Button>
    </div>
  ) : (
    <Button
      onClick={() => {
        void signInWithPopup(firebase.auth, firebase.authProvider);
      }}
    >
      Sign in
    </Button>
  );
}
