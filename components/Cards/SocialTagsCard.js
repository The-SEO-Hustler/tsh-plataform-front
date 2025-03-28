import React from "react";
import { Share2 } from "lucide-react";
import BaseCard from "./BaseCard";

export default function SocialTagsCard({
  data,
  status,
  isFocused,
  onFocus,
  description,
}) {
  const renderSocialTag = (tag, value) => (
    <div key={tag} className="flex justify-between items-start py-1 gap-1">
      <span className="font-medium">{tag}:</span>
      <span className="break-words text-right truncate">{value}</span>
    </div>
  );

  return (
    <BaseCard
      id="socialTags"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Social Media Tags"
      icon={Share2}
      description={description}
    >
      <div className="space-y-1 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Open Graph Tags</h4>
          <div className="">
            {Object.entries(data.openGraph.present).map(([tag, value]) =>
              renderSocialTag(tag, value)
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Twitter Card Tags</h4>
          <div className="">
            {Object.entries(data.twitterCard.present).map(([tag, value]) =>
              renderSocialTag(tag, value)
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
