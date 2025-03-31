import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ImageResponsivenessCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { totalImages, score, details } = data;
  const [showAll, setShowAll] = useState(false);

  const displayedDetails = showAll ? details : details.slice(0, 1);

  return (
    <BaseCard
      id="image-responsiveness"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Image Responsiveness"
      icon={iconMapping["image-responsiveness"]}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Images: <span className="font-medium">{totalImages}</span>
          </div>
          <div className="text-sm">
            Score:{" "}
            <span
              className={`font-medium ${
                score >= 8
                  ? "text-green-600"
                  : score >= 5
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {score}/100
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {displayedDetails.map((detail, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Ratio: {detail.ratio}
                </span>
                <span
                  className={`text-sm font-medium ${
                    !detail.score
                      ? "text-gray-400"
                      : detail.score >= 60
                      ? "text-green-600"
                      : detail.score >= 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {detail.score
                    ? `Score: ${detail.score}/100`
                    : "Not initially loaded"}
                </span>
              </div>
              <img
                src={detail.src}
                alt={`Image ${index + 1}`}
                className="w-full h-auto  max-h-[150px]  object-contain"
              />
              <p className="text-sm text-gray-600 break-words">
                {detail.message}
              </p>
            </div>
          ))}
        </div>

        {details.length > 1 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">
                  Show Less
                </span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">
                  Show {details.length - 1} More
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </BaseCard>
  );
}
