import React from "react";
import BaseCard from "./BaseCard";
import { Network } from "lucide-react";

export default function CdnCheckCard({ data, status, analysis, onFocus, isFocused }) {
  const { usesCDN, cdnCount, resources, provider } = data || {};
  const resourceList = Array.isArray(resources) ? resources : [];

  return (
    <BaseCard
      id="cdnCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="CDN Check"
      icon={Network}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">CDN Usage:</span>
          <span className={`font-medium ${usesCDN ? "text-green-600" : "text-yellow-600"}`}>
            {usesCDN ? "Enabled" : "Not Detected"}
          </span>
        </div>

        {usesCDN && provider && (
          <div className="p-2 bg-gray-50 dark:bg-accent rounded-md">
            <span className="text-sm font-medium dark:text-foreground">Provider: </span>
            <span className="text-sm dark:text-foreground">{provider}</span>
          </div>
        )}

        {usesCDN && (cdnCount != null || resourceList.length > 0) && (
          <div className="space-y-2">
            {cdnCount != null && (
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-accent rounded-md">
                <span className="text-sm font-medium dark:text-foreground">CDN Resources:</span>
                <span className="text-sm dark:text-foreground">{cdnCount}</span>
              </div>
            )}
            {resourceList.length > 0 && (
              <div className="space-y-2">
                {resourceList.slice(0, 3).map((resource, index) => (
                  <div key={index} className="p-2 bg-gray-50 dark:bg-accent rounded-md">
                    <div className="text-sm truncate dark:text-foreground">{resource}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
} 