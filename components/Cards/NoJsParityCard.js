import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const pct = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}%`;
};

export default function NoJsParityCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const withJs = data?.withJs || {};
  const withoutJs = data?.withoutJs || {};
  const derived = data?.derived || {};

  const structuredWithJs = safeNum(derived.structuredWithJs);
  const structuredWithoutJs = safeNum(derived.structuredWithoutJs);
  const hiddenTextCount = safeNum(derived.hiddenTextCount);
  const motionHiddenCount = safeNum(derived.motionHiddenCount);

  return (
    <BaseCard
      id="noJsParity"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="No-JS Parity"
      icon={iconMapping.noJsParity}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Link ratio</span>
            <span className="font-semibold">{pct(derived.linkRatio)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Structured data (JS)</span>
            <span className="font-semibold">{structuredWithJs}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Structured data (no JS)</span>
            <span className="font-semibold">{structuredWithoutJs}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Hidden text nodes</span>
            <span className="font-semibold">{hiddenTextCount}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Motion-hidden nodes</span>
            <span className="font-semibold">{motionHiddenCount}</span>
          </div>
        </div>

        {(withJs?.summary || withoutJs?.summary) && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Snapshot</h4>
            <div className="grid grid-cols-1 gap-2">
              {withJs?.summary && (
                <div className="rounded-md border border-foreground/10 bg-muted/20 p-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    With JS
                  </div>
                  <div className="text-sm break-words">{withJs.summary}</div>
                </div>
              )}
              {withoutJs?.summary && (
                <div className="rounded-md border border-foreground/10 bg-muted/20 p-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Without JS
                  </div>
                  <div className="text-sm break-words">{withoutJs.summary}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}

