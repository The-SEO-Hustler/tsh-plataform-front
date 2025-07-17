import React from "react";
import BaseCard from "./BaseCard";
import { CheckCircle } from "lucide-react";

export default function CacheCheckCard({ data, status, analysis, onFocus, isFocused }) {
  if (!data) return null;
  const { caching, headers } = data;

  return (
    <BaseCard
      id="cacheCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Cache Check"
      icon={CheckCircle}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">Caching Status:</span>
          <span className={`font-medium ${caching ? "text-green-600" : "text-red-600"} dark:text-foreground`}>
            {caching ? "Enabled" : "Disabled"}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Cache Headers:</h4>
          <div className="space-y-2">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="p-2 bg-gray-50 dark:bg-accent rounded-md">
                <div className="flex items-center justify-between flex-1 min-w-0 gap-1">
                  <span className="text-sm font-medium whitespace-nowrap dark:text-foreground">{key}:</span>
                  <span className="text-sm truncate dark:text-foreground">{value || "Not Set"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 