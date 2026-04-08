"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AuthHistoryTooltip({ isLoggedIn }) {
  if (isLoggedIn) return null;

  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-foreground/70">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-help"
            aria-label="Login required to save run history"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Login required to save run history</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Sign in with Google to link runs to your account and access them later
          in My Runs.
        </TooltipContent>
      </Tooltip>
      <Link
        href="/login"
        className="underline dark:text-primary text-foreground"
      >
        Login
      </Link>
    </div>
  );
}
