import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Image, ChevronDown, ChevronUp } from "lucide-react";

export default function BrokenImagesCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    totalChecked = 0,
    brokenCount = 0,
    brokenImages = [],
    passedImages = 0,
  } = data || {};
  const [showBroken, setShowBroken] = useState(false);

  return (
    <BaseCard
      id="brokenImages"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Broken Images"
      icon={iconMapping["brokenImages"] || Image}
      analysis={analysis}
    >
      <div className="space-y-2.5 text-sm">
        <div className="flex gap-3">
          <div className="flex-1 bg-muted/40 rounded-md p-2 text-center">
            <div className="font-bold text-lg text-green-600">
              {passedImages}
            </div>
            <div className="text-xs text-muted-foreground">OK</div>
          </div>
          <div className="flex-1 bg-muted/40 rounded-md p-2 text-center">
            <div
              className={`font-bold text-lg ${brokenCount > 0 ? "text-red-600" : "text-green-600"}`}
            >
              {brokenCount}
            </div>
            <div className="text-xs text-muted-foreground">broken</div>
          </div>
          <div className="flex-1 bg-muted/40 rounded-md p-2 text-center">
            <div className="font-bold text-lg">{totalChecked}</div>
            <div className="text-xs text-muted-foreground">checked</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Capped to 20 images, so we don&apos;t overload the page.
        </div>
        {brokenImages.length > 0 && (
          <div>
            <button
              onClick={() => setShowBroken((p) => !p)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showBroken ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {showBroken ? "Hide" : "Show"} broken images
            </button>
            {showBroken && (
              <ul className="mt-1 space-y-1 max-h-28 overflow-y-auto">
                {brokenImages.map((img, i) => (
                  <li
                    key={i}
                    className="text-xs bg-red-50 dark:bg-accent rounded p-1.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-red-700">
                        {img.statusCode ?? img.error ?? "error"}
                      </span>
                      <span className="text-muted-foreground break-all">
                        {img.src}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
