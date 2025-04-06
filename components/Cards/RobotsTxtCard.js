import React, { useState } from "react";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
export default function RobotsTxtCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);

  const displayedPaths = showAll
    ? data.disallowedPaths
    : data.disallowedPaths?.slice(0, 3);

  return (
    <BaseCard
      id="robotsTxt"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Robots.txt"
      icon={iconMapping.robotsTxt}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Status:</span>
          <span className={data.exists ? "text-green-700" : "text-red-500"}>
            {data.exists ? "Present ✓" : "Missing ✕"}
          </span>
        </div>
        {data.disallowedPaths && data.disallowedPaths.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">Disallowed Paths:</span>
            <div
              className={`relative ${!showAll &&
                `md:after:absolute md:after:bottom-0 md:after:left-0 md:after:w-full md:after:h-12 md:after:bg-gradient-to-t  ${status === "normal" ? "md:after:from-[#eff1f6]" : status === "warning" ? "md:after:from-[#f9f5c4]" : "md:after:from-[#f9dfe1]"} md:after:to-transparent`
                }`}
            >
              <ul className="mt-1 space-y-1">
                {displayedPaths.map((path, index) => (
                  <li key={index} className="break-words">
                    {path}
                  </li>
                ))}
              </ul>
            </div>
            {data.disallowedPaths.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                {showAll ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show All ({data.disallowedPaths.length}){" "}
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
        {data.content && (
          <div className="mt-2">
            <span className="font-medium">Content:</span>
            <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-[300px]">
              {data.content}
            </pre>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
