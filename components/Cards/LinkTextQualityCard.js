import React, { useMemo, useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const formatRate = (rate) => {
  const n = Number(rate);
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}%`;
};

const ExampleRow = ({ example, kind }) => {
  if (!example) return null;

  const href = example.href || example.url;
  const text = example.text;
  const context = example.context;

  return (
    <div className="space-y-1 break-words rounded-md border border-foreground/10 bg-muted/20 p-2">
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline underline-offset-2 break-all"
        >
          {href}
        </a>
      )}
      {typeof text === "string" && text.trim() && (
        <div className="text-sm">
          <span className="text-muted-foreground">Text:</span>{" "}
          <span className="font-medium">{text}</span>
        </div>
      )}
      {typeof context === "string" && context.trim() && (
        <div className="text-xs text-muted-foreground">
          <span className="uppercase tracking-wide mr-1">Context:</span>
          <span>{context}</span>
        </div>
      )}
      {!href && !text && !context && (
        <div className="text-xs text-muted-foreground">
          Example available ({kind})
        </div>
      )}
    </div>
  );
};

export default function LinkTextQualityCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);

  const counts = data?.counts || {};

  const total = safeNum(counts.total);
  const emptyOrNoName = safeNum(counts.emptyOrNoName);
  const generic = safeNum(counts.generic);
  const veryShort = safeNum(counts.veryShort);
  const iconOrMediaOnly = safeNum(counts.iconOrMediaOnly);
  const cardLike = safeNum(counts.cardLike);
  const badInContent = safeNum(counts.badInContent);

  const worstCounts = useMemo(() => {
    const items = [
      { key: "Empty / no name", value: emptyOrNoName },
      { key: "Generic", value: generic },
      { key: "Very short", value: veryShort },
      { key: "Icon/media only", value: iconOrMediaOnly },
      { key: "Card-like", value: cardLike },
      { key: "Bad in content", value: badInContent },
    ];
    return items.sort((a, b) => b.value - a.value);
  }, [
    emptyOrNoName,
    generic,
    veryShort,
    iconOrMediaOnly,
    cardLike,
    badInContent,
  ]);

  const exampleGroups = useMemo(() => {
    const examples = data?.examples || {};
    const groups = [
      { key: "emptyOrNoName", label: "Empty / no name", items: examples.emptyOrNoName || [] },
      { key: "generic", label: "Generic", items: examples.generic || [] },
      { key: "iconOrMediaOnly", label: "Icon/media only", items: examples.iconOrMediaOnly || [] },
      { key: "cardLike", label: "Card-like", items: examples.cardLike || [] },
    ];
    return groups.filter((g) => Array.isArray(g.items) && g.items.length > 0);
  }, [data?.examples]);

  const maxExamplesPerGroup = showAll ? 50 : 3;

  return (
    <BaseCard
      id="linkTextQuality"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Link Text Quality"
      icon={iconMapping.linkTextQuality}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Total links</span>
            <span className="font-semibold">{total}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Bad in content</span>
            <span className="font-semibold">{badInContent}</span>
          </div>
          <div className="flex items-center justify-between gap-2 col-span-2">
            <span className="text-muted-foreground">Bad in content rate</span>
            <span className="font-semibold">
              {formatRate(data?.badInContentRate)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Breakdown</h4>
          <div className="space-y-1 text-sm">
            {worstCounts.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.key}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {exampleGroups.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Examples</h4>
              {exampleGroups.some((g) => g.items.length > 3) && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="text-xs text-primary underline underline-offset-2"
                >
                  {showAll ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {exampleGroups.map((group) => (
                <div key={group.key} className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.label} ({group.items.length})
                  </div>
                  <div className="space-y-2">
                    {group.items.slice(0, maxExamplesPerGroup).map((ex, idx) => (
                      <ExampleRow
                        key={`${group.key}-${idx}`}
                        example={ex}
                        kind={group.key}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
