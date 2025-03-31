import React from "react";
import BaseCard from "./BaseCard";
import { AlertTriangle } from "lucide-react";

export default function JsErrorsCheckCard({ data, status, analysis, onFocus, isFocused }) {
  const { jsErrors } = data;

  return (
    <BaseCard
      id="jsErrorsCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="JavaScript Errors Check"
      icon={AlertTriangle}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Total Errors:</span>
          <span className="font-medium text-gray-900">{jsErrors.length}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Error Details:</h4>
          <div className="space-y-2">
            {jsErrors.slice(0, 3).map((error, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 