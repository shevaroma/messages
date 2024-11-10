import GoogleIcon from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignIn = ({ signIn }: { signIn: () => void }) => (
  <div className="flex h-screen w-full items-center justify-center px-4">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Join the conversation, stay in touch, and sync effortlessly with our
          messaging app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={signIn}>
          <GoogleIcon />
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  </div>
);
export default SignIn;
