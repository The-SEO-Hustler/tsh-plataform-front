import React from "react";
import BaseCard from "./BaseCard";
import { CheckCircle } from "lucide-react";

export default function CacheCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  if (!data) return null;
  const { caching, headers, testedUrl } = data;

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
        <div className="flex flex-col p-3 bg-gray-50 dark:bg-accent rounded-lg gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-foreground">
              Caching Status:
            </span>
            <span
              className={`font-medium ${caching ? "text-green-600" : "text-red-600"} dark:text-foreground`}
            >
              {caching ? "Enabled" : "Disabled"}
            </span>
          </div>
          {testedUrl && (
            <div className="text-xs text-gray-500 dark:text-foreground/60 break-all">
              Tested on: {testedUrl.split("?")[0]}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Cache Headers:</h4>
          <div className="space-y-2">
            {Object.entries(headers).map(([key, value]) => (
              <div
                key={key}
                className="p-2 bg-gray-50 dark:bg-accent rounded-md"
              >
                {/* 
                  Changed layout from horizontal to vertical-stack on small screens, 
                  and removed 'truncate' so long cache-control strings wrap safely 
                */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <span className="text-sm font-medium whitespace-nowrap dark:text-foreground">
                    {key}:
                  </span>
                  <span className="text-sm break-all text-left sm:text-right dark:text-foreground">
                    {value || "Not Set"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
