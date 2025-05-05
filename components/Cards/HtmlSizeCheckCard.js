import React from "react";
import BaseCard from "./BaseCard";
import { FileText } from "lucide-react";
import { iconMapping } from "@/lib/config";

export default function HtmlSizeCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { sizeInBytes, sizeInKB } = data;

  return (
    <BaseCard
      id="htmlSizeCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="HTML Size Check"
      icon={iconMapping.htmlSizeCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1">Size in Bytes</div>
            <div className="text-lg font-medium">
              {sizeInBytes.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1">Size in KB</div>
            <div className="text-lg font-medium">
              {sizeInKB} KB
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <div className="text-sm">
            {parseFloat(sizeInKB) > 500
              ? "HTML size is above recommended limit (500KB)"
              : "HTML size is within recommended limits"}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
