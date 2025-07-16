"use client";

import React, { Suspense } from "react";
import { useFirebase } from "@/lib/firebase-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getPathname } from "@/lib/getpathname";
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

function AnalysisStatusCardContent() {
  const { currentAnalysis, clearAnalysis } = useFirebase();
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
    router.push(`${getPathname(currentAnalysis?.type)}/result?id=${currentAnalysis?.docId}`);
  };

  const scoreAppearance = getScoreAppearance(currentAnalysis?.score?.score);
  const ScoreIcon = scoreAppearance?.icon;

  // Do not render if there's no analysis or if we're already on the SEO check page with a docId.
  if (!currentAnalysis || (pathname.includes("/result") && docId)) {
    return null;
  }

  return (
    <div className="min-w-[295px] fixed bottom-4 md:right-4 right-4 bg-card rounded-lg shadow-lg py-5 px-7 max-w-md border !border-foreground/10 z-50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`${currentAnalysis?.status !== "completed" &&
              currentAnalysis?.status !== "failed"
              ? "animate-spin duration-2000"
              : ""
              }`}
          >
            {getStatusIcon(currentAnalysis?.status)}
          </div>
          <h3 className="font-medium !text-foreground !text-base">
            {getStatusText(currentAnalysis?.status)}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm !text-foreground/80 mb-3 truncate">
          {currentAnalysis?.url || currentAnalysis?.keyword || currentAnalysis?.query}
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_FRONT_URL}${getPathname(currentAnalysis?.type)}/result?id=${currentAnalysis?.docId}`
            );
            toast.success("Link to analysis copied to clipboard");
          }}
          className="cursor-pointer mb-2"
        >
          <Copy className="h-4 w-4 !text-foreground/80" />
        </button>
      </div>

      {currentAnalysis?.status === "failed" && currentAnalysis?.error && (
        <div className="text-sm !text-red-600 mb-3">
          {currentAnalysis?.error}
        </div>
      )}

      <div className="flex justify-end items-center gap-2">
        {currentAnalysis?.status === "completed" && currentAnalysis?.score && (
          <div className="flex items-center gap-2 ">
            <div
              className={`h-8 rounded-md gap-1.5 px-3 font-medium py-0.5 flex items-center border ${scoreAppearance?.borderColor} ${scoreAppearance?.bgColor} ${scoreAppearance?.textColor}`}
            >
              <div className={`${scoreAppearance?.textColor} flex items-center gap-1 text-sm md:text-base`}>
                <ScoreIcon size={14} />
                <span>
                  Score: {currentAnalysis?.score?.score || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
        <Button
          size="sm"
          onClick={handleViewAnalysis}
          className="flex items-center gap-1 cursor-pointer !text-primary-foreground"
        >
          View Results
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {(currentAnalysis?.status === "completed" ||
        currentAnalysis?.status === "failed") && (
          <button
            onClick={() => clearAnalysis()}
            className="flex absolute top-0 right-0 items-center gap-1 cursor-pointer p-2 rounded-md hover:!bg-foreground/10"
          >
            <X className="h-4 w-4 !text-foreground/80" />
          </button>
        )}
    </div>
  );
}

export default function AnalysisStatusCard() {
  return (
    <Suspense fallback={<div className="min-w-[295px] fixed bottom-4 md:right-4 right-4 bg-card rounded-lg shadow-lg py-5 px-7 max-w-md border !border-foreground/10 z-50">
      <p className="!text-foreground">
        Loading analysis status...
      </p>
    </div>}>
      <AnalysisStatusCardContent />
    </Suspense>
  );
}
