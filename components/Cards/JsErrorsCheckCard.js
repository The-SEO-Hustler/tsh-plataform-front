import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function JsErrorsCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedErrors = showAll ? data.jsErrors : data.jsErrors.slice(0, 3);

  return (
    <BaseCard
      id="jsErrorsCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="JavaScript Errors Check"
      icon={iconMapping.jsErrorsCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">Total Errors:</span>
          <span className="font-medium dark:text-foreground">
            {data.jsErrors.length}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Error Details:</h4>
          <div className="space-y-2">
            {displayedErrors.map((error, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="min-w-5 min-h-5 text-yellow-700 mt-0.5 dark:text-foreground" size={14} />
                  <p className="text-sm  line-clamp-5 dark:text-foreground">{error}</p>
                </div>
              </div>
            ))}
          </div>
          {data.jsErrors.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-accent rounded-lg transition-colors duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 dark:text-foreground" />
                  <span className="text-sm font-medium dark:text-foreground">
                    Show Less
                  </span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 dark:text-foreground" />
                  <span className="text-sm font-medium dark:text-foreground">
                    Show {data.jsErrors.length - 3} More
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
