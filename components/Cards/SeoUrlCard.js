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
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">URL:</span>
          <span className="font-medium dark:text-foreground">{url}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">URL Checks:</h4>
          <div className="flex flex-col gap-2">
            {Object.entries(checks).map(([check, value]) => (

              <div className="flex justify-between items-center" key={check}>
                <span>{check.replace(/([A-Z])/g, " $1").trim()}: {`${value}`}</span>
                <span className="text-blue-500">{value ? <Check className="text-green-700 dark:text-green-500" /> : <X className="text-red-700" />}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
