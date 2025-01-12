import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInButton from "@/components/sign-in-button";

const SignInPage = () => (
  <div className="flex h-screen w-full items-center justify-center px-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in to Messages</CardTitle>
        <CardDescription>
          Join the conversation, stay in touch, and sync effortlessly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInButton />
      </CardContent>
    </Card>
  </div>
);

export default SignInPage;
