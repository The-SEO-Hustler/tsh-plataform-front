import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import { Link } from "lucide-react";

const hopColor = (type) => {
  if (type === "final") return "bg-green-100 text-green-700";
  if (type === "permanent") return "bg-blue-100 text-blue-700";
  if (type === "temporary" || type === "temporary-keep-method")
    return "bg-amber-100 text-amber-700";
  if (type === "request_failed") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
};

export default function RedirectChainCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    redirectCount = 0,
    chain = [],
    finalUrl,
    hasHttpToHttps,
    chainTooLong,
  } = data || {};

  return (
    <BaseCard
      id="redirectChain"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Redirect Chain"
      icon={iconMapping["redirectChain"] || Link}
      analysis={analysis}
    >
      <div className="space-y-2.5 text-sm">
        <div className="flex gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${redirectCount === 0 ? "bg-green-100 text-green-700" : chainTooLong ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
          >
            {redirectCount} redirect{redirectCount !== 1 ? "s" : ""}
          </span>
          {hasHttpToHttps && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              HTTP→HTTPS ✓
            </span>
          )}
          {chainTooLong && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Chain too long
            </span>
          )}
        </div>

        {chain.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {chain.map((hop, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs">
                {i > 0 && (
                  <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                )}
                {i === 0 && <span className="w-3 h-3 flex-shrink-0" />}
                <span
                  className={`px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${hopColor(hop.type)}`}
                >
                  {hop.status}
                </span>
                <span className="text-muted-foreground dark:text-foreground/80 break-all">
                  {hop.url}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
