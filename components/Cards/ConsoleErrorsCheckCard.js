import React from "react";
import BaseCard from "./BaseCard";
import { Terminal } from "lucide-react";

export default function ConsoleErrorsCheckCard({ data, status, analysis, onFocus, isFocused }) {
  const { consoleErrors } = data;

  return (
    <BaseCard
      id="consoleErrorsCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Console Errors Check"
      icon={Terminal}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Total Console Errors:</span>
          <span className="font-medium text-gray-900">{consoleErrors.length}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Error Details:</h4>
          <div className="space-y-2">
            {consoleErrors.slice(0, 3).map((error, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-gray-500 mt-0.5" />
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