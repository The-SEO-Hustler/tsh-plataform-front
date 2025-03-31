import React from "react";
import { Heading2 } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";

export default function H2TagsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="h2Tags"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="H2 Tags"
      icon={iconMapping.h2Tags}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total H2 Tags:</span>
          <span
            className={data.count > 20 ? "text-yellow-500" : "text-green-500"}
          >
            {data.count}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Status:</span>
          <span className={data.hasH2 ? "text-green-500" : "text-red-500"}>
            {data.hasH2 ? "Present ✓" : "Missing ✕"}
          </span>
        </div>
        {data.headers && data.headers.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">H2 Values:</span>
            <ul className="mt-1 space-y-1">
              {data.headers.map((header, index) => (
                <li key={index} className="break-words">
                  {header.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
