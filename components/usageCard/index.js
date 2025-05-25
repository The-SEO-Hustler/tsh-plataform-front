"use client";
import React from "react";
import { useUsage } from "@/lib/usage-context";
import { usePathname } from "next/navigation";

function UsageCard() {
  const { usage } = useUsage();
  const pathname = usePathname();

  if (pathname.includes("/result")) {
    return null;
  }

  const progressBarStyle = {
    width: usage ? `${(usage.remaining / usage.limit) * 100}%` : "0%",
    height: "8px",
    backgroundColor: "#4caf50",
  };

  return (
    <div className="bg-card p-3 px-4 rounded-lg shadow-lg fixed bottom-2 left-1/2 transform -translate-x-1/2 z-10 w-64 border border-foreground/10 text-foreground">
      {usage ? (
        <div>
          <div className="flex mb-2 text-sm text-center justify-center">
            <span>
              {usage.remaining}/{usage.limit} daily free usage available
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-background rounded-full h-2.5">
            <div style={progressBarStyle} className="rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="flex justify-between mb-2 text-transparent animate-pulse bg-gray-200 dark:bg-foreground/10 rounded-md">
            <span>0/0 daily free usage available</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-foreground/10 rounded-full h-2.5 animate-pulse">
            <div style={progressBarStyle} className="rounded-full "></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsageCard;
