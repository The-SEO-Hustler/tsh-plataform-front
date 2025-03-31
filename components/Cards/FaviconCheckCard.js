import React from "react";
import BaseCard from "./BaseCard";
import { ImageIcon } from "lucide-react";

export default function FaviconCheckCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { faviconPresent, faviconUrl } = data;

  return (
    <BaseCard
      id="faviconCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Favicon Check"
      icon={ImageIcon}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              {faviconUrl ? (
                <img src={faviconUrl} />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  faviconPresent ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {faviconPresent ? "Favicon Present" : "No Favicon Found"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
