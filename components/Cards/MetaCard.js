import React from "react";
import { Globe } from "lucide-react";
import BaseCard from "./BaseCard";

export default function MetaCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="meta"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Meta Information"
      icon={Globe}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Title Tag</span>
          <span className="text-green-500">✓</span>
        </div>
        <div className="flex justify-between">
          <span>Meta Description</span>
          <span className="text-red-500">x</span>
        </div>
        <div className="flex justify-between">
          <span>Robots.txt</span>
          <span className="text-green-500">✓</span>
        </div>
      </div>
    </BaseCard>
  );
}
