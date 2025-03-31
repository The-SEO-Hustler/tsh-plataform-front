import React from "react";
import BaseCard from "./BaseCard";
import { CheckCircle } from "lucide-react";

export default function CacheCheckCard({ data, status, analysis, onFocus, isFocused }) {
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
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Caching Status:</span>
          <span className={`font-medium ${caching ? "text-green-600" : "text-red-600"}`}>
            {caching ? "Enabled" : "Disabled"}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Cache Headers:</h4>
          <div className="space-y-2">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{key}:</span>
                  <span className="text-sm text-gray-600">{value || "Not Set"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
} 