import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { iconMapping } from "@/app/seo-audit/config";

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
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Total Console Errors:</span>
          <span className="font-medium text-gray-900">
            {data.consoleErrors.length}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Error Details:</h4>
          <div className="space-y-2">
            {displayedErrors.map((error, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
              </div>
            ))}
          </div>
          {data.consoleErrors.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">
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
