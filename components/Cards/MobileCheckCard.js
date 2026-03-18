import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import {
  Smartphone,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function MobileCheckCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    hasViewportMeta,
    viewportContent,
    mobilePerformance = {},
    tapTargetIssues = [],
    fontSizeIssues = 0,
  } = data || {};
  const [showTapTargets, setShowTapTargets] = useState(false);

  return (
    <BaseCard
      id="mobileCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Mobile Check"
      icon={iconMapping["mobileCheck"] || Smartphone}
      analysis={analysis}
    >
      <div className="space-y-2.5 text-sm">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Viewport meta</span>
            {hasViewportMeta ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {(mobilePerformance.fcp > 0 || mobilePerformance.lcp > 0) && (
          <div className="space-y-1 text-xs border-t border-foreground/10 pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile FCP</span>
              <span>{mobilePerformance.fcp} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile LCP</span>
              <span>{mobilePerformance.lcp} ms</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 text-xs">
          {tapTargetIssues.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {tapTargetIssues.length} small tap target
              {tapTargetIssues.length !== 1 ? "s" : ""}
            </span>
          )}
          {fontSizeIssues > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {fontSizeIssues} small font{fontSizeIssues !== 1 ? "s" : ""}
            </span>
          )}
          {tapTargetIssues.length === 0 && fontSizeIssues === 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
              No issues
            </span>
          )}
        </div>

        {tapTargetIssues.length > 0 && (
          <div>
            <button
              onClick={() => setShowTapTargets((p) => !p)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showTapTargets ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {showTapTargets ? "Hide" : "Show"} tap target issues
            </button>
            {showTapTargets && (
              <div className="mt-1 max-h-28 overflow-y-auto space-y-1">
                {tapTargetIssues.map((t, i) => (
                  <div
                    key={i}
                    className="text-xs bg-muted/40 rounded px-2 py-1 flex justify-between"
                  >
                    <span className="font-mono">
                      &lt;{t.element}&gt; {t.text?.slice(0, 30)}
                    </span>
                    <span className="text-amber-700 font-medium">
                      {t.size}px
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewportContent && (
          <div className="text-xs text-muted-foreground border-t border-foreground/10 pt-1 break-all">
            {viewportContent}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
