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
  const { totalNodes, maxDepth } = data;

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
              {totalNodes.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-accent rounded-lg">
            <div className="text-sm mb-1 dark:text-foreground">Max Depth</div>
            <div className="text-lg font-medium dark:text-foreground">{maxDepth}</div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <div className="text-sm dark:text-foreground">
            {totalNodes > 1000
              ? "DOM size is above recommended limit (1000 nodes)"
              : "DOM size is within recommended limits"}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
