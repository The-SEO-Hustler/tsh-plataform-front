"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/lib/firebase-context";
import { LogOut, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const router = useRouter();
  const { user, authLoading, logout } = useFirebase();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "Logout failed");
    }
  };

  if (!authLoading && !user) {
    return (
      <main className="py-10 min-h-[70vh]">
        <Container className="max-w-lg">
          <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-foreground/80">
              Please login to view your account.
            </p>
            <Link href="/login" className="text-primary underline">
              Go to login
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-10 min-h-[70vh]">
      <Container className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">My Account</h1>
              <p className="text-sm text-foreground/80">
                {user?.displayName || user?.email || "User"}
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/my-runs"
              className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent/60 transition-colors !no-underline"
            >
              View My Runs
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
