import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

export default function DomSizeCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const totalNodes =
    typeof data?.totalNodes === "number"
      ? data.totalNodes
      : data?.totalElements
        ? data?.totalElements
        : null;
  const maxDepth = typeof data?.maxDepth === "number" ? data.maxDepth : null;
  const maxChildren =
    typeof data?.maxChildren === "number" ? data.maxChildren : null;

  return (
    <BaseCard
      id="domSizeCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="DOM Size Check"
      icon={iconMapping.domSizeCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1 dark:text-foreground">Total Nodes</div>
            <div className="text-lg font-medium dark:text-foreground">
              {totalNodes === null ? "—" : totalNodes.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1 dark:text-foreground">Max Depth</div>
            <div className="text-lg font-medium dark:text-foreground">
              {maxDepth === null ? "—" : maxDepth}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1 dark:text-foreground">
              Max Children
            </div>
            <div className="text-lg font-medium dark:text-foreground">
              {maxChildren === null ? "—" : maxChildren}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <div className="text-sm dark:text-foreground">
            {typeof totalNodes === "number" && totalNodes > 1500
              ? "DOM size is above recommended limit (1500 nodes)"
              : "DOM size is within recommended limits"}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
