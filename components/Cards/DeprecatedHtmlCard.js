import React from "react";
import BaseCard from "./BaseCard";
import { AlertTriangle } from "lucide-react";

export default function DeprecatedHtmlCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const hasDeprecated = Boolean(data?.hasDeprecated);
  const count = typeof data?.count === "number" ? data.count : 0;
  const tagSummary = data?.tagSummary && typeof data.tagSummary === "object"
    ? data.tagSummary
    : {};
  const elements = Array.isArray(data?.elements) ? data.elements : [];

  return (
    <BaseCard
      id="deprecatedHtml"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Deprecated HTML Check"
      icon={AlertTriangle}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">
            Deprecated / unsemantic tags found:
          </span>
          <span className="font-medium dark:text-foreground">{count}</span>
        </div>

        {count > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Deprecated Elements:
            </h4>

            {Object.keys(tagSummary).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(tagSummary)
                  .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                  .slice(0, 8)
                  .map(([tag, tagCount]) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-full border border-foreground/10 dark:border-foreground/15 text-foreground/80 dark:text-foreground/80"
                    >
                      &lt;{tag}&gt; ({tagCount})
                    </span>
                  ))}
              </div>
            )}

            <div className="space-y-2">
              {elements.map((element, index) => {
                const el =
                  typeof element === "string"
                    ? { tag: element }
                    : element || {};
                const tag = el.tag || "unknown";
                const suggestion = el.suggestion || "";
                const outerHTML = el.outerHTML || "";

                return (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-accent rounded-lg space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5 dark:text-foreground" />
                      <p className="text-sm font-medium dark:text-foreground">
                        &lt;{tag}&gt;
                      </p>
                    </div>

                    {suggestion ? (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Suggestion: {suggestion}
                      </p>
                    ) : null}

                    {outerHTML ? (
                      <pre
                        className="text-[10px] text-muted-foreground whitespace-pre-wrap break-words line-clamp-3 overflow-hidden"
                        title={outerHTML}
                      >
                        {outerHTML}
                      </pre>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!hasDeprecated && count === 0 && (
          <div className="p-3 bg-green-50 dark:bg-accent rounded-lg">
            <p className="text-sm text-foreground dark:text-foreground">
              No deprecated / unsemantic HTML tags found.
            </p>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
