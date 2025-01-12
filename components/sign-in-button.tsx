"use client";

import { Button } from "@/components/ui/button";
import { signInWithPopup } from "@firebase/auth";
import firebase from "@/lib/firebase";
import GoogleIcon from "@/components/google-icon";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const router = useRouter();
  return (
    <Button
      className="w-full"
      onClick={async () => {
        await signInWithPopup(firebase.auth, firebase.authProvider);
        router.push("/");
      }}
    >
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
};

export default SignInButton;
