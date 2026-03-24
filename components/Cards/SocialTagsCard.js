import React from "react";
import { Share2 } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
export default function SocialTagsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const renderSocialTag = (tag, value) => {
    // Safely extract the string if the backend passed an object
    let displayValue = value;
    if (typeof value === "object" && value !== null) {
      // Look for common keys your backend uses, fallback to stringify if it's completely unknown
      displayValue =
        value.content ||
        value.description ||
        value.property ||
        JSON.stringify(value);
    }

    return (
      <div key={tag} className="flex justify-between items-start py-1 gap-2">
        <span className="font-medium text-gray-700 dark:text-foreground">
          {tag}:
        </span>
        <span
          className="break-all text-right truncate text-gray-500 dark:text-foreground/60"
          title={displayValue}
        >
          {displayValue}
        </span>
      </div>
    );
  };

  return (
    <BaseCard
      id="socialTags"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Social Media Tags"
      icon={iconMapping.socialTags}
      analysis={`OpenGraph: ${analysis?.openGraph} | TwitterCard: ${analysis?.twitterCard}`}
    >
      <div className="space-y-1 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Open Graph Tags</h4>
          <div className="">
            {Object.entries(data.openGraph.present).map(([tag, value]) =>
              renderSocialTag(tag, value),
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Twitter Card Tags</h4>
          <div className="">
            {Object.entries(data.twitterCard.present).map(([tag, value]) =>
              renderSocialTag(tag, value),
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
