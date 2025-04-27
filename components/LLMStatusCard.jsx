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

function LLMStatusCardContent() {
  const { currentLLMTxt, removeLLMTxt } = useFirebase();
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
        return <SettingsIcon className="h-5 w-5 text-gray-500" />;
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
    router.push(`/llms-txt-generator/result?id=${currentLLMTxt?.docId}`);
  };



  if (!currentLLMTxt || (pathname === "/llms-txt-generator/result" && docId)) {
    return null;
  }

  return (
    <div className="min-w-[295px] fixed bottom-4 md:right-4 right-4 bg-white rounded-lg shadow-lg py-5 px-7 max-w-md border border-gray-200 z-50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`${currentLLMTxt?.status !== "completed" &&
              currentLLMTxt?.status !== "failed"
              ? "animate-spin duration-2000"
              : ""
              }`}
          >
            {getStatusIcon(currentLLMTxt?.status)}
          </div>
          <h3 className="font-medium text-gray-900 !text-base">
            {getStatusText(currentLLMTxt?.status)}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-600 mb-3 truncate">
          {currentLLMTxt?.url}
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_FRONT_URL}/llms-txt-generator/result?id=${currentLLMTxt?.docId}`
            );
            toast.success("Link to analysis copied to clipboard");
          }}
          className="cursor-pointer mb-2"
        >
          <Copy className="h-4 w-4" color="#101828" />
        </button>
      </div>

      {currentLLMTxt?.status === "failed" && currentLLMTxt?.error && (
        <div className="text-sm text-red-600 mb-3">
          {currentLLMTxt?.error}
        </div>
      )}

      <div className="flex justify-end items-center gap-2">

        <Button
          size="sm"
          onClick={handleViewAnalysis}
          className="flex items-center gap-1 cursor-pointer"
        >
          View Results
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {(currentLLMTxt?.status === "completed" ||
        currentLLMTxt?.status === "failed") && (
          <button
            onClick={() => removeLLMTxt()}
            className="flex absolute top-0 right-0 items-center gap-1 cursor-pointer p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" color="#101828" />
          </button>
        )}
    </div>
  );
}

export default function LLMStatusCard() {
  return (
    <Suspense fallback={<div className="min-w-[295px] fixed bottom-4 md:right-4 right-4 bg-white rounded-lg shadow-lg py-5 px-7 max-w-md border border-gray-200 z-50">
      <p>
        Loading analysis status...
      </p>
    </div>}>
      <LLMStatusCardContent />
    </Suspense>
  );
}
