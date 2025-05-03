import React, { useState } from "react";
import { Heading1, ChevronDown, ChevronUp } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

export default function H1Card({ data, status, isFocused, onFocus, analysis }) {
  const [showAll, setShowAll] = useState(false);
  const displayedValues = showAll ? data.value : data.value.slice(0, 10);

  return (
    <BaseCard
      id="h1"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="H1 Tags"
      icon={iconMapping.h1}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total H1 Tags:</span>
          <span
            className={data.length > 1 ? "text-yellow-700 dark:text-yellow-500" : "text-green-700 dark:text-green-500"}
          >
            {data.length}
          </span>
        </div>
        <div className="mt-2">
          <span className="font-medium">H1 Values:</span>
          <ul className="mt-1 space-y-1">
            {displayedValues.map((value, index) => (
              <li key={index} className="break-words">
                {value || "(empty)"}
              </li>
            ))}
          </ul>
          {data.value.length > 10 && (
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
                  <span className="text-sm font-medium">
                    Show {data.value.length - 10} More
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
