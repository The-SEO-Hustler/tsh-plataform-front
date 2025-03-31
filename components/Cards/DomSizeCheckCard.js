import React from "react";
import BaseCard from "./BaseCard";
import { Network } from "lucide-react";

export default function DomSizeCheckCard({ data, status, analysis, onFocus, isFocused }) {
  const { totalNodes, maxDepth } = data;

  return (
    <BaseCard
      id="domSizeCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="DOM Size Check"
      icon={Network}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Nodes</div>
            <div className="text-lg font-medium text-gray-900">
              {totalNodes.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Max Depth</div>
            <div className="text-lg font-medium text-gray-900">
              {maxDepth}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {totalNodes > 1000
              ? "DOM size is above recommended limit (1000 nodes)"
              : "DOM size is within recommended limits"}
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 