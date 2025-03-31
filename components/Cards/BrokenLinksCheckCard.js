import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function BrokenLinksCheckCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedBrokenLinks = showAll
    ? data.brokenLinks
    : data.brokenLinks.slice(0, 5);
  const displayedNon200Links = showAll
    ? data.non200Links
    : data.non200Links.slice(0, 5);

  return (
    <BaseCard
      id="brokenLinksCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Broken Links Check"
      icon={iconMapping.brokenLinksCheck}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total Links:</span>
          <span className="text-blue-500">{data.totalLinks}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Internal Links:</span>
          <span className="text-green-700">{data.internalLinks}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>External Links:</span>
          <span className="text-blue-500">{data.externalLinks}</span>
        </div>
        {data.brokenLinks && data.brokenLinks.length > 0 && (
          <div className="mt-2">
            <span className="font-medium text-red-500">Broken Links:</span>
            <ul className="mt-1 space-y-1">
              {displayedBrokenLinks.map((link, index) => (
                <li key={index} className="break-words">
                  {link.anchor}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.non200Links && data.non200Links.length > 0 && (
          <div className="mt-2">
            <span className="font-medium text-yellow-700">
              Non-200 Status Links:
            </span>
            <ul className="mt-1 space-y-1">
              {displayedNon200Links.map((link, index) => (
                <li key={index} className="break-words">
                  {link.anchor}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(data.brokenLinks.length > 5 || data.non200Links.length > 5) && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 mt-2"
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
                  Show{" "}
                  {Math.max(
                    data.brokenLinks.length - 5,
                    data.non200Links.length - 5
                  )}{" "}
                  More
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </BaseCard>
  );
}
