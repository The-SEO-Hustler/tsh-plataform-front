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
  const sizeInBytes =
    typeof data?.sizeInBytes === "number" ? data.sizeInBytes : null;
  const sizeInKB = data?.sizeInKB ? data.sizeInKB : null;

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
      {/* {JSON.stringify({ data, status, analysis }, null, 2)} */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1 dark:text-foreground">
              Size in Bytes
            </div>
            <div className="text-lg font-medium dark:text-foreground">
              {sizeInBytes === null ? "—" : sizeInBytes.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1 dark:text-foreground">Size in KB</div>
            <div className="text-lg font-medium dark:text-foreground">
              {sizeInKB === null ? "—" : `${sizeInKB} KB`}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <div className="text-sm dark:text-foreground">
            {status === "error"
              ? "Critical Size Warning"
              : "Size is within recommended limits"}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
