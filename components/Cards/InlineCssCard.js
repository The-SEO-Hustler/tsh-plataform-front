import React from "react";
import BaseCard from "./BaseCard";
import { Code } from "lucide-react";

export default function InlineCssCard({ data, status, analysis, onFocus, isFocused }) {
  const { hasInline, count, elements } = data;

  return (
    <BaseCard
      id="inlineCss"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Inline CSS Check"
      icon={Code}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Total Elements with Inline CSS:</span>
          <span className="font-medium text-gray-900">{count}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Sample Elements:</h4>
          <div className="space-y-2">
            {elements.slice(0, 3).map((element, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {element.tag}
                  </span>
                  <span className="text-xs text-gray-500">
                    {element.style.length} characters
                  </span>
                </div>
                <code className="text-xs text-gray-600 block truncate">
                  {element.style}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 