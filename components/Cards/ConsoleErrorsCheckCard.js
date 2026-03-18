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

  // Backward/forward compatible guards:
  // - New format includes: { consoleErrors: string[], failedRequests: {url, reason}[], jsExceptions: string[] }
  // - Old format may be missing some fields
  const consoleErrors = Array.isArray(data?.consoleErrors) ? data.consoleErrors : [];
  const failedRequests = Array.isArray(data?.failedRequests) ? data.failedRequests : [];
  const jsExceptions = Array.isArray(data?.jsExceptions) ? data.jsExceptions : [];

  const displayedErrors = showAll ? consoleErrors : consoleErrors.slice(0, 3);
  const displayedFailed = showAll ? failedRequests : failedRequests.slice(0, 3);
  const displayedExceptions = showAll ? jsExceptions : jsExceptions.slice(0, 3);

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
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Console errors</div>
            <div className="font-bold dark:text-foreground">{consoleErrors.length}</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Failed requests</div>
            <div className="font-bold dark:text-foreground">{failedRequests.length}</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg text-center">
            <div className="text-xs text-muted-foreground">JS exceptions</div>
            <div className="font-bold dark:text-foreground">{jsExceptions.length}</div>
          </div>
        </div>

        {(consoleErrors.length > 0 || failedRequests.length > 0 || jsExceptions.length > 0) && (
          <div className="space-y-3">
            {consoleErrors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Console errors</h4>
                <div className="space-y-2">
                  {displayedErrors.map((error, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                      <div className="flex items-start gap-2">
                        <Terminal className="min-w-5 min-h-5 text-gray-500 mt-0.5 dark:text-foreground" size={14} />
                        <p className="text-sm line-clamp-5 dark:text-foreground">{error}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {failedRequests.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Failed requests</h4>
                <div className="space-y-2">
                  {displayedFailed.map((req, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                      <div className="text-sm dark:text-foreground break-words">{req?.url || "Unknown URL"}</div>
                      <div className="text-xs text-muted-foreground">{req?.reason || "Unknown reason"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jsExceptions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">JS exceptions</h4>
                <div className="space-y-2">
                  {displayedExceptions.map((ex, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                      <div className="text-sm dark:text-foreground break-words">{ex}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(consoleErrors.length > 3 || failedRequests.length > 3 || jsExceptions.length > 3) && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-accent rounded-lg transition-colors duration-200"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 dark:text-foreground" />
                    <span className="text-sm font-medium dark:text-foreground">Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 dark:text-foreground" />
                    <span className="text-sm font-medium dark:text-foreground">
                      Show More
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
