import React from "react";
import BaseCard from "./BaseCard";
import { FileText } from "lucide-react";
import { iconMapping } from "@/lib/config";

export default function CharsetCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { charsetDeclared } = data;

  return (
    <BaseCard
      id="charsetCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Charset Check"
      icon={iconMapping.charsetCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-accent rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-background flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400 dark:text-foreground" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${charsetDeclared ? "bg-green-700 dark:bg-green-500" : "bg-red-500"
                  }`}
              />
              <span className="text-sm font-medium">
                {charsetDeclared
                  ? "Charset Declared"
                  : "No Charset Declaration"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
