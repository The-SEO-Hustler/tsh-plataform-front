import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Download, RefreshCw } from "lucide-react";

export default function NetworkRequestsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const summary =
    data?.summary && typeof data.summary === "object" ? data.summary : {};
  const bars = Array.isArray(data?.horizontalBar) ? data.horizontalBar : [];
  const requestBreakdown =
    data?.requestBreakdown && typeof data.requestBreakdown === "object"
      ? data.requestBreakdown
      : null;

  // New payload labels from backend; keep legacy fallbacks.
  const totalRequestsValue = summary.totalRequests ?? data?.totalRequests ?? 0;
  const totalPayloadLabel =
    summary.totalPayloadLabel ??
    (typeof data?.totalSize === "number"
      ? `${(data.totalSize / (1024 * 1024)).toFixed(2)} MB`
      : "—");
  const totalTimeLabel =
    summary.totalTimeLabel ??
    (typeof data?.totalTime === "number"
      ? `${data.totalTime.toFixed(0)} ms`
      : "—");

  const crossOriginHiddenValue = data?.crossOriginHidden;
  const crossOriginHiddenNote =
    typeof crossOriginHiddenValue === "string"
      ? crossOriginHiddenValue
      : typeof crossOriginHiddenValue === "number" && crossOriginHiddenValue > 0
        ? `${crossOriginHiddenValue} request(s) were hidden due to cross-origin constraints; payload may be a lower-bound estimate.`
        : crossOriginHiddenValue === true
          ? "Some requests were hidden due to cross-origin constraints; payload may be a lower-bound estimate."
          : "";

  const breakdownEntries = requestBreakdown
    ? Object.entries(requestBreakdown).filter(([, value]) =>
        ["number", "string"].includes(typeof value),
      )
    : [];

  return (
    <BaseCard
      id="network-requests"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Network & Payload"
      icon={iconMapping["network-requests"]}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Overview</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
              <p className="text-xs text-muted-foreground">Total payload</p>
              <p className="text-sm font-semibold dark:text-foreground">
                {totalPayloadLabel}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
              <p className="text-xs text-muted-foreground">Total requests</p>
              <p className="text-sm font-semibold dark:text-foreground">
                {totalRequestsValue}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
              <p className="text-xs text-muted-foreground">Total time</p>
              <p className="text-sm font-semibold dark:text-foreground">
                {totalTimeLabel}
              </p>
            </div>
          </div>
        </div>

        {bars.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Payload distribution</p>
            <div className="space-y-3">
              {bars.map((item, idx) => {
                const percent = Math.max(
                  0,
                  Math.min(100, Number(item?.percentOfPayload) || 0),
                );
                return (
                  <div
                    key={`${item?.label || "item"}-${idx}`}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium dark:text-foreground">
                        {item?.label || "Unknown"}
                      </span>
                      <span className="text-muted-foreground">
                        {(Number(item?.bytes) || 0).toLocaleString()} bytes
                        {" • "}
                        {Number(item?.count) || 0} req
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-accent overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {percent.toFixed(1)}% of payload
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {breakdownEntries.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Request breakdown</p>
            <div className="flex flex-wrap gap-2">
              {breakdownEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-accent text-foreground/80"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {crossOriginHiddenNote && (
          <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg flex items-start gap-2">
            <RefreshCw className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium dark:text-foreground">
                Cross-origin visibility
              </p>
              <p className="text-sm text-muted-foreground">
                {crossOriginHiddenNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
