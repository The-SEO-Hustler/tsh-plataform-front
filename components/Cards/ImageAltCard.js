import React, { useState } from "react";
import { Image, ChevronDown, ChevronUp } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

export default function ImageAltCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedImages = showAll
    ? data.imagesWithoutAlt
    : data.imagesWithoutAlt.slice(0, 6);

  return (
    <BaseCard
      id="image-alt"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Image Alt Text"
      icon={iconMapping["image-alt"]}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total Images:</span>
          <span className="text-blue-500">{data.totalImages}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Images with Alt:</span>
          <span className="text-green-700">{data.imagesWithAlt}</span>
        </div>
        {data.imagesWithoutAlt && data.imagesWithoutAlt.length > 0 && (
          <div className="mt-2">
            <span className="font-medium ">Images Without Alt Text:</span>
            <ul className="mt-2 grid grid-cols-3 gap-1">
              {displayedImages.map((image, index) => (
                <li
                  key={index}
                  className="break-words border rounded-md overflow-hidden
                   h-full flex items-center aspect-square"
                >
                  <img src={image.src} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                </li>
              ))}
            </ul>
            {data.imagesWithoutAlt.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 mt-2"
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
                      Show {data.imagesWithoutAlt.length - 6} More
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
