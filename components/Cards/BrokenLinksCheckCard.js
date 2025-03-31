import React from "react";
import { Link } from "lucide-react";
import BaseCard from "./BaseCard";

export default function BrokenLinksCheckCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="brokenLinksCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Broken Links Check"
      icon={Link}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total Links:</span>
          <span className="text-blue-500">{data.totalLinks}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Internal Links:</span>
          <span className="text-green-500">{data.internalLinks}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>External Links:</span>
          <span className="text-blue-500">{data.externalLinks}</span>
        </div>
        {data.brokenLinks && data.brokenLinks.length > 0 && (
          <div className="mt-2">
            <span className="font-medium text-red-500">Broken Links:</span>
            <ul className="mt-1 space-y-1">
              {data.brokenLinks.map((link, index) => (
                <li key={index} className="break-words">
                  {link.anchor}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.non200Links && data.non200Links.length > 0 && (
          <div className="mt-2">
            <span className="font-medium text-yellow-500">
              Non-200 Status Links:
            </span>
            <ul className="mt-1 space-y-1">
              {data.non200Links.map((link, index) => (
                <li key={index} className="break-words">
                  {link.anchor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
