import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              className={`font-medium ${score >= 8
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
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {detail.ratio}x
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${!detail.score
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

                        <button className="text-gray-500 hover:text-gray-700">
                          <Info className="w-4 h-4" />
                        </button>


                      </div>
                    </div>
                    <img
                      src={detail?.src}
                      alt={`Image ${index + 1}`}
                      className="w-full h-auto max-h-[150px] object-cover rounded-md"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]" side="right">
                  <div className="space-y-2">
                    <p className="font-medium">Image Details:</p>
                    <div className="space-y-1 text-sm">
                      {detail?.currentSize && (
                        <p><span className="font-medium">Current Size:</span> {detail?.currentSize?.width}×{detail?.currentSize?.height}px</p>
                      )}
                      {detail?.displaySize && (
                        <p><span className="font-medium">Displayed Size:</span> {detail?.displaySize?.width}×{detail?.displaySize?.height}px</p>
                      )}
                      {detail?.recommendedSize && (
                        <p><span className="font-medium">Recommended Size:</span> {detail?.recommendedSize?.width}×{detail?.recommendedSize?.height}px</p>
                      )}
                      {detail?.hasExplicitDimensions && (
                        <p className="text-green-600">✓ Has explicit dimensions</p>
                      )}
                      {detail?.loading && (
                        <p className="text-blue-600">Loading: {detail?.loading}</p>
                      )}
                      {detail?.alt && (
                        <p className="text-gray-600">Alt text: {detail?.alt}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{detail?.message}</p>
                  </div>
                </TooltipContent>
              </Tooltip>

            </TooltipProvider>
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
