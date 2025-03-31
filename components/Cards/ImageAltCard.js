import React from "react";
import { Image } from "lucide-react";
import BaseCard from "./BaseCard";

export default function ImageAltCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="image-alt"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Image Alt Text"
      icon={Image}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total Images:</span>
          <span className="text-blue-500">{data.totalImages}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Images with Alt:</span>
          <span className="text-green-500">{data.imagesWithAlt}</span>
        </div>
        {data.imagesWithoutAlt && data.imagesWithoutAlt.length > 0 && (
          <div className="mt-2">
            <span className="font-medium text-yellow-500">
              Images Without Alt Text:
            </span>
            <ul className="mt-1 grid-cols-2 grid items-center gap-1">
              {data.imagesWithoutAlt.map((image, index) => (
                <li
                  key={index}
                  className="break-words border border-black rounded-md overflow-hidden
                   h-full flex items-center"
                >
                  <img src={image.src} />
                  {/* {image.src.slice()} */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
