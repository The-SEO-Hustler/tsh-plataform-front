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
  const renderSocialTag = (tag, value) => (
    <div key={tag} className="flex justify-between items-start py-1 gap-1">
      <span className="font-medium">{JSON.stringify(tag)}:</span>
      <span className="break-words text-right truncate">
        {JSON.stringify(value)}
      </span>
    </div>
  );

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
