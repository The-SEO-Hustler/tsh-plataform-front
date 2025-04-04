import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";
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
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Total Errors:</span>
          <span className="font-medium text-gray-900">
            {data.jsErrors.length}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Error Details:</h4>
          <div className="space-y-2">
            {displayedErrors.map((error, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="min-w-5 min-h-5 text-yellow-700 mt-0.5" size={14} />
                  <p className="text-sm text-gray-600  line-clamp-5">{error}</p>
                </div>
              </div>
            ))}
          </div>
          {data.jsErrors.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">
                    Show Less
                  </span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">
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
