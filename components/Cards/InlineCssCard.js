import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { Code, ChevronDown, ChevronUp } from "lucide-react";
import { iconMapping } from "@/lib/config";

export default function InlineCssCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const [displayCount, setDisplayCount] = useState(3);
  const displayedElements = data.elements.slice(0, displayCount);

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 5, data.elements.length));
  };

  const handleShowLess = () => {
    setDisplayCount(3);
  };

  return (
    <BaseCard
      id="inlineCss"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Inline CSS Check"
      icon={iconMapping.inlineCss}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">Total Elements with Inline CSS:</span>
          <span className="font-medium dark:text-foreground">{data.count}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sample Elements:</h4>
          <div className="space-y-2">
            {displayedElements.map((element, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium dark:text-foreground ">
                    {element.tag}
                  </span>
                  <span className="text-xs text-gray-500">
                    {element.style.length} characters
                  </span>
                </div>
                <div className="relative">
                  <code className="text-xs  block bg-gray-100 dark:bg-background/50 p-2 rounded-md overflow-x-auto">
                    {element.style}
                  </code>
                  <div className="absolute top-1 right-1">
                    <Code className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.elements.length > 3 && (
            <button
              onClick={displayCount === 3 ? handleShowMore : handleShowLess}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:text-foreground dark:hover:text-foreground rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {displayCount > 3 ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Show 5 More Examples
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