"use client";

import React, { Suspense } from "react";
import { useFirebase } from "@/lib/firebase-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  SettingsIcon,
  X,
  Copy,
} from "lucide-react";
import { statusMessages } from "@/lib/statusMessages";
import { getScoreAppearance } from "@/lib/getScoreAppearance";
import { toast } from "sonner";

function SearchIntentStatusCardContent() {
  const { currentSearchIntent, removeSearchIntent } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");

  // Function to get the status icon based on the analysis status.
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <SettingsIcon className="h-5 w-5 text-gray-500 dark:text-foreground/80" />;
    }
  };

  // Function to get the status text based on the analysis status.
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Analysis in progress";
      case "completed":
        return "Analysis completed";
      case "failed":
        return "Analysis failed";
      default:
        return statusMessages[status]?.title;
    }
  };

  // Function to handle viewing the analysis.
  const handleViewAnalysis = () => {
    router.push(`/search-intent/result?id=${currentSearchIntent?.docId}`);
  };


  // Do not render if there's no analysis or if we're already on the SEO check page with a docId.
  if (!currentSearchIntent || (pathname === "/search-intent/result" && docId)) {
    return null;
  }

  return (
    <div className="min-w-[295px] fixed bottom-4 md:right-4 right-4 bg-card rounded-lg shadow-lg py-5 px-7 max-w-md border !border-foreground/10 z-50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`${currentSearchIntent?.status !== "completed" &&
              currentSearchIntent?.status !== "failed"
              ? "animate-spin duration-2000"
              : ""
              }`}
          >
            {getStatusIcon(currentSearchIntent?.status)}
          </div>
          <h3 className="font-medium !text-foreground !text-base">
            {getStatusText(currentSearchIntent?.status)}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm !text-foreground/80 mb-3 truncate">
          {currentSearchIntent?.url}
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_FRONT_URL}/search-intent/result?id=${currentSearchIntent?.docId}`
            );
            toast.success("Link to analysis copied to clipboard");
          }}
          className="cursor-pointer mb-2"
        >
          <Copy className="h-4 w-4 !text-foreground/80 " />
        </button>
      </div>

      {currentSearchIntent?.status === "failed" && currentSearchIntent?.error && (
        <div className="text-sm !text-red-600 mb-3">
          {currentSearchIntent?.error}
        </div>
      )}

      <div className="flex justify-end items-center gap-2">

        <Button
          size="sm"
          onClick={handleViewAnalysis}
          className="flex items-center gap-1 cursor-pointer text-primary-foreground "
        >
          View Results
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {(currentSearchIntent?.status === "completed" ||
        currentSearchIntent?.status === "failed") && (
          <button
            onClick={() => removeSearchIntent()}
            className="flex absolute top-0 right-0 items-center gap-1 cursor-pointer p-2 rounded-md hover:!bg-foreground/10"
          >
            <X className="h-4 w-4 !text-foreground/80" />
          </button>
        )}
    </div>
  );
}

export default function SearchIntentStatusCard() {
  return (
    <Suspense fallback={<div className="min-w-[295px] fixed bottom-4 md:right-4 right-4 bg-card rounded-lg shadow-lg py-5 px-7 max-w-md border !border-foreground/10 z-50">
      <p className="!text-foreground">
        Loading analysis status...
      </p>
    </div>}>
      <SearchIntentStatusCardContent />
    </Suspense>
  );
}
