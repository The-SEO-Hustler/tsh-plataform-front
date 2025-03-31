import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";

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
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">URL:</span>
          <span className="font-medium text-gray-900">{url}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">URL Checks:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(checks).map(([check, value]) => (
              <div
                key={check}
                className={`p-2 rounded-md text-sm bg-gray-50 border-r-2 ${
                  value ? "border-r-green-700 " : "border-r-red-700"
                }`}
              >
                {check.replace(/([A-Z])/g, " $1").trim()}: {`${value}`}
                {/* {value ? "Failed" : "Passed"} */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
