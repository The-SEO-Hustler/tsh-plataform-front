import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Check, X } from "lucide-react";

export default function SeoUrlCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { url, checks } = data;

  // Map the raw backend keys to clean, professional UI labels
  const checkLabels = {
    isLowercase: "All lowercase characters",
    noConsecutiveDashes: "No consecutive dashes",
    noSpecialChars: "No special characters",
    isMeaningful: "Meaningful URL structure",
    noExtraSlashes: "No extra slashes",
  };

  return (
    <BaseCard
      id="seo-url"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="SEO URL Check"
      icon={iconMapping["seo-url"]}
      analysis={analysis}
    >
      <div className="space-y-4">
        {/* URL Display Block */}
        <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm font-semibold dark:text-foreground">
            URL:
          </span>
          <span className="text-sm dark:text-foreground break-all">{url}</span>
        </div>

        {/* Checks List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">URL Checks:</h4>
          <div className="flex flex-col gap-2">
            {Object.entries(checks).map(([check, value]) => {
              // Use the mapping, or fallback to Regex formatting if a new check is added later
              const label =
                checkLabels[check] || check.replace(/([A-Z])/g, " $1").trim();

              return (
                <div
                  className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  key={check}
                >
                  <span className="text-sm text-gray-700 dark:text-foreground">
                    {label}
                  </span>
                  <span>
                    {value ? (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 dark:text-red-500" />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
