import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { iconMapping } from "@/lib/config";

export default function ConsoleErrorsCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedErrors = showAll ? data.consoleErrors : data.consoleErrors.slice(0, 3);

  return (
    <BaseCard
      id="consoleErrorsCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Console Errors Check"
      icon={iconMapping.consoleErrorsCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm">Total Console Errors:</span>
          <span className="font-medium">
            {data.consoleErrors.length}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Error Details:</h4>
          <div className="space-y-2">
            {displayedErrors.map((error, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                <div className="flex items-start gap-2">
                  <Terminal className="min-w-5 min-h-5 text-gray-500 mt-0.5" size={14} />
                  <p className="text-sm line-clamp-5">{error}</p>
                </div>
              </div>
            ))}
          </div>
          {data.consoleErrors.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-accent rounded-lg transition-colors duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Show {data.consoleErrors.length - 3} More
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
