import React from "react";
import { FileText } from "lucide-react";
import BaseCard from "./BaseCard";

export default function MetaDescriptionCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="meta-description"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Meta Description"
      icon={FileText}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="break-words">
          <span className="font-medium">Description:</span> {data.value}
        </div>
        <div className="flex justify-between items-center">
          <span>Length:</span>
          <span
            className={`${data.length > 160 ? "text-yellow-700 dark:text-yellow-500" : "text-green-700 dark:text-green-500"
              }`}
          >
            {data.length} characters
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Status:</span>
          <span className={data.isPresent ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"}>
            {data.isPresent ? "Present ✓" : "Missing ✕"}
          </span>
        </div>
      </div>
    </BaseCard>
  );
}
