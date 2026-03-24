import React, { useMemo, useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Code, ChevronDown, ChevronUp } from "lucide-react";

export default function StructuredDataCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    hasStructuredData,
    jsonLd,
    microdata,
    openGraph,
    totalSchemas,
    schemaTypes,
  } = data || {};

  // Backward/forward compatible guards. Older runs may have different shapes.
  const jsonLdList = Array.isArray(jsonLd) ? jsonLd : [];
  const microdataList = Array.isArray(microdata) ? microdata : [];
  const schemaTypesList = Array.isArray(schemaTypes) ? schemaTypes : [];
  const schemaCount =
    typeof totalSchemas === "number"
      ? totalSchemas
      : schemaTypesList.length || jsonLdList.length;
  const structuredPresent =
    typeof hasStructuredData === "boolean"
      ? hasStructuredData
      : schemaCount > 0 || jsonLdList.length > 0 || microdataList.length > 0;
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [selectedJsonLdIndex, setSelectedJsonLdIndex] = useState(0);
  const [prettyJson, setPrettyJson] = useState(true);

  const selectedJsonLd = jsonLdList[selectedJsonLdIndex] || null;

  const formattedSelectedJson = useMemo(() => {
    if (!selectedJsonLd?.raw) return "";
    if (!prettyJson) return String(selectedJsonLd.raw);
    try {
      const obj = JSON.parse(selectedJsonLd.raw);
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(selectedJsonLd.raw);
    }
  }, [prettyJson, selectedJsonLd?.raw]);

  return (
    <BaseCard
      id="structuredData"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Structured Data"
      icon={iconMapping["structuredData"] || Code}
      analysis={analysis}
    >
      <div className="space-y-3 overflow-hidden">
        <div className="flex flex-wrap gap-2 text-sm">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              structuredPresent
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {structuredPresent
              ? `${schemaCount} schema(s)`
              : "No structured data"}
          </span>
          {openGraph?.present && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              OpenGraph
            </span>
          )}
          {microdataList.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {microdataList.length} Microdata
            </span>
          )}
        </div>

        {schemaTypesList.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground dark:text-foreground/80">
                Schema types
              </span>
              {schemaTypesList.length > 8 && (
                <button
                  type="button"
                  className="text-xs text-primary flex items-center gap-1 cursor-pointer shrink-0 dark:text-foreground"
                  onClick={() => setShowAllTypes((v) => !v)}
                >
                  {showAllTypes ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Show all
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {(showAllTypes
                ? schemaTypesList
                : schemaTypesList.slice(0, 8)
              ).map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="text-xs bg-muted px-1.5 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {jsonLdList.length > 0 && (
          <div className="space-y-2 overflow-hidden">
            <div className="text-xs font-medium text-muted-foreground">
              JSON-LD blocks
            </div>

            <div className="flex items-center gap-2">
              <select
                className="w-full bg-background border border-foreground/10 rounded-md px-2 py-1 text-xs"
                value={selectedJsonLdIndex}
                onChange={(e) =>
                  setSelectedJsonLdIndex(Number(e.target.value) || 0)
                }
              >
                {jsonLdList.map((schema, i) => (
                  <option key={i} value={i}>
                    {schema?.type || `Schema ${i + 1}`}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="shrink-0 text-xs px-2 py-1 rounded-md border border-foreground/10 bg-muted hover:bg-muted/70"
                onClick={() => setPrettyJson((v) => !v)}
                title={prettyJson ? "Showing pretty JSON" : "Showing raw JSON"}
              >
                {prettyJson ? "Pretty" : "Raw"}
              </button>
            </div>

            {selectedJsonLd?.type && (
              <div className="text-xs text-muted-foreground">
                Type:{" "}
                <span className="text-foreground">{selectedJsonLd.type}</span>
              </div>
            )}

            <div className="bg-muted/40 rounded-md overflow-hidden border border-foreground/10">
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Viewer
                </span>
                <button
                  type="button"
                  className="text-xs text-primary flex items-center gap-1"
                  onClick={() =>
                    setExpandedIndex(
                      expandedIndex === selectedJsonLdIndex
                        ? null
                        : selectedJsonLdIndex,
                    )
                  }
                >
                  {expandedIndex === selectedJsonLdIndex ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Expand
                    </>
                  )}
                </button>
              </div>
              {expandedIndex === selectedJsonLdIndex && (
                <pre className="px-3 pb-3 text-[11px] leading-relaxed overflow-auto max-h-36 whitespace-pre-wrap break-words text-foreground/80">
                  {formattedSelectedJson}
                </pre>
              )}
              {expandedIndex !== selectedJsonLdIndex && (
                <pre className="px-3 pb-3 text-[11px] leading-relaxed overflow-hidden max-h-24 whitespace-pre-wrap break-words text-foreground/60">
                  {formattedSelectedJson}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
