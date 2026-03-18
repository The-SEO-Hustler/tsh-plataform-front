import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
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
  const {
    totalImages,
    evaluatedImages,
    failedImages,
    skippedSvgs,
    score,
    details,
  } = data || {};

  const detailsList = Array.isArray(details) ? details : [];
  const [showAll, setShowAll] = useState(false);

  const orderedDetails = [...detailsList].sort((a, b) => {
    if (!a.score && b.score) return 1;
    if (a.score && !b.score) return -1;
    if (!a.score && !b.score) return 0;
    return a.score - b.score;
  });
  const displayedDetails = showAll ? orderedDetails : orderedDetails.slice(0, 3);

  const renderImageDetails = (detail) => {
    // Support both old and new shapes
    const currentWidth =
      detail?.currentSize?.width ?? detail?.naturalWidth ?? null;
    const currentHeight = detail?.currentSize?.height ?? null;
    const displayWidth = detail?.displaySize?.width ?? null;
    const displayHeight = detail?.displaySize?.height ?? null;
    const recommendedWidth =
      detail?.recommendedSize?.width ?? detail?.idealWidth ?? null;
    const recommendedHeight = detail?.recommendedSize?.height ?? null;
    const ratio = detail?.ratio || detail?.widthRatio || null;

    return (
      <div className="space-y-2">
        <p className="font-medium">Image Details:</p>
        <div className="space-y-1 text-xs sm:text-sm">
          {currentWidth && (
            <p>
              <span className="font-medium">Served width:</span>{" "}
              {currentWidth}px
              {currentHeight ? ` × ${currentHeight}px` : ""}
            </p>
          )}
          {displayWidth && (
            <p>
              <span className="font-medium">Displayed width:</span>{" "}
              {displayWidth}px
              {displayHeight ? ` × ${displayHeight}px` : ""}
            </p>
          )}
          {recommendedWidth && (
            <p>
              <span className="font-medium">Ideal width:</span>{" "}
              {recommendedWidth}px
              {recommendedHeight ? ` × ${recommendedHeight}px` : ""}
            </p>
          )}
          {ratio && (
            <p>
              <span className="font-medium">Width ratio:</span>{" "}
              {ratio}×
            </p>
          )}
          {detail?.hasExplicitDimensions && (
            <p className="text-green-600 dark:text-green-400">
              ✓ Has explicit dimensions
            </p>
          )}
          {detail?.hasSrcset !== undefined && (
            <p className="text-xs text-muted-foreground">
              Srcset: {detail.hasSrcset ? "present" : "missing"}
            </p>
          )}
          {detail?.loading && (
            <p className="text-blue-600 dark:text-blue-400">
              Loading: {detail.loading}
            </p>
          )}
          {detail?.alt && <p>Alt text: {detail.alt}</p>}
        </div>
        {detail?.message && (
          <p className="text-xs sm:text-sm mt-2 break-words text-muted-foreground">
            {detail.message}
          </p>
        )}
      </div>
    );
  };

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
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex flex-wrap gap-3 items-center">
            {typeof totalImages === "number" && (
              <span>
                Total images:{" "}
                <span className="font-medium">{totalImages}</span>
              </span>
            )}
            {typeof evaluatedImages === "number" && (
              <span className="text-muted-foreground text-xs sm:text-sm">
                Evaluated:{" "}
                <span className="font-medium text-foreground">
                  {evaluatedImages}
                </span>
              </span>
            )}
            {typeof failedImages === "number" && failedImages > 0 && (
              <span className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                Failed: {failedImages}
              </span>
            )}
            {typeof skippedSvgs === "number" && skippedSvgs > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                Skipped SVGs: {skippedSvgs}
              </span>
            )}
          </div>
          {typeof score === "number" && (
            <div className="text-sm">
              Score:{" "}
              <span
                className={`font-medium ${
                  score >= 80
                    ? "text-green-600"
                    : score >= 50
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {score}/100
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {displayedDetails.map((detail, index) => {
            const ratioDisplay = detail?.ratio || detail?.widthRatio || null;

            return (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-accent rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    {ratioDisplay && (
                      <span className="text-xs font-medium text-muted-foreground">
                        Ratio:{" "}
                        <span className="text-foreground">
                          {ratioDisplay}×
                        </span>
                      </span>
                    )}
                    {detail?.alt && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {detail.alt}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        !detail.score
                          ? "text-gray-400"
                          : detail.score >= 80
                          ? "text-green-600"
                          : detail.score >= 50
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {detail.score ? `Score: ${detail.score}/100` : "N/A"}
                    </span>
                    {/* Desktop Tooltip */}
                    <div className="hidden md:block">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-foreground dark:hover:text-foreground">
                              <Info className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-[300px]"
                            side="right"
                          >
                            {renderImageDetails(detail)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                {detail?.src && (
                  <img
                    src={detail.src}
                    alt={detail.alt || `Image ${index + 1}`}
                    className="w-full h-auto max-h-[150px] object-cover rounded-md"
                  />
                )}
                {/* Mobile Details */}
                <div className="md:hidden mt-2">
                  {renderImageDetails(detail)}
                </div>
              </div>
            );
          })}
        </div>

        {detailsList.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:text-foreground dark:hover:text-foreground rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 dark:text-foreground" />
                <span className="text-sm font-medium dark:text-foreground">
                  Show Less
                </span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 dark:text-foreground" />
                <span className="text-sm font-medium dark:text-foreground">
                  Show {detailsList.length - 3} More
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </BaseCard>
  );
}
