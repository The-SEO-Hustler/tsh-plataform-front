import React from "react";
import BaseCard from "./BaseCard";
import { Component } from "lucide-react";
import { iconMapping } from "@/lib/config";

export default function HtmlCompressionCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { compressed, encoding } = data;

  return (
    <BaseCard
      id="htmlCompression"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="HTML Compression"
      icon={iconMapping.htmlCompression}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Component className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${compressed ? "bg-green-700" : "bg-red-500"
                  }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {compressed ? "HTML is Compressed" : "HTML is Not Compressed"}
              </span>
            </div>
            {encoding && (
              <div className="mt-2 text-sm text-gray-600">
                Encoding: {encoding}
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
