"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useFirebase } from "@/lib/firebase-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { user, authLoading, loginWithGoogle } = useFirebase();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/free-tools");
    }
  }, [authLoading, router, user]);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in successfully");
      router.replace("/free-tools");
    } catch (error) {
      toast.error(error?.message || "Google login failed");
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center">
      <Container className="max-w-lg">
        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-foreground/80">
            Continue with your Google account to save and track your tool runs.
          </p>
          <Button onClick={handleGoogleSignIn} className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
        </div>
      </Container>
    </main>
  );
}
