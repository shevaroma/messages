"use client";

import firebase from "@/app/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const [user] = useAuthState(firebase.auth);
  return user != null ? (
    <div>
      <pre>{user.uid}</pre>
      <button
        onClick={() => {
          void signOut(firebase.auth);
        }}
      >
        Sign out
      </button>
    </div>
  ) : (
    <button
      onClick={() => {
        void signInWithPopup(firebase.auth, firebase.authProvider);
      }}
    >
      Sign in
    </button>
  );
}
