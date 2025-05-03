import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

export default function RequestCountCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { count, resources } = data;

  return (
    <BaseCard
      id="requestCountCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Request Count Check"
      icon={iconMapping.requestCountCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm">Total Requests:</span>
          <span className="font-medium">{count}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Resource Types:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-accent rounded-md text-sm">
              CSS Files: {resources.filter((r) => r.endsWith(".css")).length}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-accent rounded-md text-sm">
              JS Files: {resources.filter((r) => r.endsWith(".js")).length}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-accent rounded-md text-sm">
              Images:{" "}
              {
                resources.filter((r) =>
                  r.match(/\.(jpg|jpeg|png|gif|webp|avif)/i)
                ).length
              }
            </div>
            <div className="p-2 bg-gray-50 dark:bg-accent rounded-md text-sm">
              Other:{" "}
              {
                resources.filter(
                  (r) => !r.match(/\.(css|js|jpg|jpeg|png|gif|webp|avif)/i)
                ).length
              }
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
