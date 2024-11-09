"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "@firebase/auth";
import firebase from "@/lib/firebase";
import GoogleIcon from "@/components/google-icon";

const SignInButton = ({ className = "" }: { className: string }) => (
  <Button
    className={className}
    onClick={() => {
      void signInWithPopup(firebase.auth, firebase.authProvider);
    }}
  >
    <GoogleIcon />
    Sign in with Google
  </Button>
);

export default SignInButton;
