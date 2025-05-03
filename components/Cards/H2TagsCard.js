import React, { useState } from "react";
import { Heading2, ChevronDown, ChevronUp } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

export default function H2TagsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedHeaders = showAll ? data.headers : data.headers.slice(0, 10);

  return (
    <BaseCard
      id="h2Tags"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="H2 Tags"
      icon={iconMapping.h2Tags}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total H2 Tags:</span>
          <span
            className={data.count > 20 ? "text-yellow-700 dark:text-yellow-500" : "text-green-700 dark:text-green-500"}
          >
            {data.count}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Status:</span>
          <span className={data.hasH2 ? "text-green-700 dark:text-green-500" : "text-red-500 dark:text-red-500"}>
            {data.hasH2 ? "Present ✓" : "Missing ✕"}
          </span>
        </div>
        {data.headers && data.headers.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">H2 Values:</span>
            <ul className="mt-1 space-y-1">
              {displayedHeaders.map((header, index) => (
                <li key={index} className="break-words">
                  {header.text}
                </li>
              ))}
            </ul>
            {data.headers.length > 10 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-card hover:bg-card/80 dark:bg-accent dark:hover:bg-accent/80 rounded-lg transition-colors duration-200 mt-2"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm font-medium ">
                      Show Less
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-sm font-medium ">
                      Show {data.headers.length - 10} More
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
