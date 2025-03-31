import React from "react";
import { Server } from "lucide-react";
import BaseCard from "./BaseCard";
export default function SitemapCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="sitemap"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Sitemap Presence"
      icon={Server}
      analysis={analysis}
    >
      <p className="text-center text-lg">{data ? "Present ✓" : "Missing ✕"}</p>
    </BaseCard>
  );
}
