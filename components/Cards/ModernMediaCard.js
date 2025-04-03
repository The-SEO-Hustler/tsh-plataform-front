import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { Image, ChevronDown, ChevronUp } from "lucide-react";
import { iconMapping } from "@/app/seo-audit/config";

export default function ModernMediaCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedImages = showAll ? data.images : data.images.slice(0, 3);
  const { totalImages, modernImages } = data;

  return (
    <BaseCard
      id="modernMedia"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Modern Media Check"
      icon={iconMapping.modernMedia}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between">
            <div className="text-sm text-gray-600 mb-1">Total Images</div>
            <div className="text-lg font-medium text-gray-900">
              {totalImages}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between">
            <div className="text-sm text-gray-600 mb-1">
              Modern Format Images
            </div>
            <div className="text-lg font-medium text-gray-900">
              {modernImages}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Image Details:</h4>
          <div className="space-y-2">
            {displayedImages.map((image, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">

                <div className="w-10 h-10">
                  <img src={image.src} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-xs" />
                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Format: {image.extension || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {image.extension === "webp" || image.extension === "avif" ? "Modern" : "Legacy"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 truncate w-full max-w-full">
                    {image.src}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.images.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">
                    Show {data.images.length - 3} More
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
