"use client";

import React from "react";
import { useFirebase } from "@/lib/firebase-context";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  CheckCircle,  
  XCircle, 
  ExternalLink,
  SettingsIcon,
  X
} from "lucide-react";
import { statusMessages } from "@/app/lib/statusMessages";
import { getScoreAppearance } from "@/app/lib/getScoreAppearance";

export default function AnalysisStatusCard() {
  const { currentAnalysis, removeAnalysis } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  // If there are no pending analyses, don't render anything

  if (!currentAnalysis || pathname === "/seo-audit") {
    return null;
  }



  // Get the first pending analysis (we'll only show one at a time)
  

  // Function to get the status icon based on the analysis status
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

  // Function to get the status text based on the analysis status
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Analysis in progress";
      case "completed":
        return "Analysis completed";
      case "failed":
        return "Analysis failed";
      default:
        return statusMessages[status].title;
    }
  };

  // Function to handle viewing the analysis
  const handleViewAnalysis = () => {
    router.push(`/seo-audit?id=${currentAnalysis.docId}`);
  };
  const scoreAppearance = getScoreAppearance(currentAnalysis.score);
  const ScoreIcon = scoreAppearance.icon;

  return (
    <div className="min-w-[275px] fixed bottom-4 right-4 bg-white rounded-lg shadow-lg py-5 px-7 max-w-md border border-gray-200 z-50">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`${currentAnalysis.status !== "completed" && currentAnalysis.status !== "failed" ? "animate-spin duration-2000" : ""}`}>
          {getStatusIcon(currentAnalysis.status)}
          </div>
          <h3 className="font-medium text-gray-900">
            {getStatusText(currentAnalysis.status)}
          </h3>
        </div>
       
      </div>
      
      <p className="text-sm text-gray-600 mb-3 truncate">
        {currentAnalysis.url}
      </p>
      
      
      
      {currentAnalysis.status === "failed" && currentAnalysis.error && (
        <div className="text-sm text-red-600 mb-3">
          {currentAnalysis.error}
        </div>
      )}
      
        <div className="flex justify-end items-center gap-2">
        {currentAnalysis.status === "completed" && (
        <div className="flex items-center gap-2 ">
          <div className={` text-xs font-medium px-2.5 py-0.5 rounded-md border ${scoreAppearance.borderColor} ${scoreAppearance.bgColor} ${scoreAppearance.textColor}`}>
            <div className={`${scoreAppearance.textColor} flex items-center gap-1`}>
            <ScoreIcon className=""  size={14}/> 
              <span>
            Score: {currentAnalysis.score || "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}
        <Button 
          size="sm"
          onClick={handleViewAnalysis}
          className="flex items-center gap-1 cursor-pointer"
        >
          View Results
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {(currentAnalysis.status === "completed" || currentAnalysis.status === "failed") && (
      <button 
        onClick={() => removeAnalysis()}
        className="flex absolute top-0 left-0 items-center gap-1 cursor-pointer p-2 rounded-md hover:bg-gray-100"
      >
        <X className="h-4 w-4" color="gray"/> 
      </button>
      )}
    </div>
  );
} 