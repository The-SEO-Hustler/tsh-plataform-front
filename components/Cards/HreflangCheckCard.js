import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Globe } from "lucide-react";

export default function HreflangCheckCard({ data, status, isFocused, onFocus, analysis }) {
  const { hasHreflang, hreflangTags = [], hasXDefault, contentLanguage, issues = [] } = data || {};

  return (
    <BaseCard
      id="hreflangCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Hreflang Tags"
      icon={iconMapping["hreflangCheck"] || Globe}
      analysis={analysis}
    >
      <div className="space-y-2.5 text-sm">
        {!hasHreflang ? (
          <p className="text-muted-foreground text-xs">No hreflang tags found — fine for single-language sites.</p>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {hreflangTags.length} tag(s)
              </span>
              {hasXDefault && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">x-default ✓</span>
              )}
              {contentLanguage && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{contentLanguage}</span>
              )}
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1">
              {hreflangTags.map((tag, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{tag.hreflang}</span>
                  <span className="text-muted-foreground truncate">{tag.href}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {issues.length > 0 && (
          <ul className="space-y-1 pt-1 border-t border-foreground/10">
            {issues.map((issue, i) => (
              <li key={i} className="text-xs text-amber-700">⚠ {issue}</li>
            ))}
          </ul>
        )}
      </div>
    </BaseCard>
  );
}
