import React, { useMemo } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Download, AlertCircle, RefreshCw } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { commonOptions } from "@/lib/commonOptions";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function NetworkRequestsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const {
    totalRequests,
    totalSize,
    totalTime,
    failedRequests,
    redirects,
    crossOriginHidden,
    resourceTypes,
  } = data || {};

  // Backward/forward compatible numeric guards
  const totalRequestsCount =
    typeof totalRequests === "number" ? totalRequests : 0;
  const totalSizeBytes = typeof totalSize === "number" ? totalSize : 0;
  const totalTimeMs = typeof totalTime === "number" ? totalTime : 0;
  const redirectsCount = typeof redirects === "number" ? redirects : 0;
  const failedCount =
    typeof failedRequests === "number"
      ? failedRequests
      : Array.isArray(failedRequests)
        ? failedRequests.length
        : 0;
  const crossOriginHiddenCount =
    typeof crossOriginHidden === "number" ? crossOriginHidden : 0;

  const successfulCount = Math.max(
    0,
    totalRequestsCount - failedCount - redirectsCount,
  );

  const resourceTypesObj =
    resourceTypes && typeof resourceTypes === "object" ? resourceTypes : null;
  const resourceTypeEntries = resourceTypesObj
    ? Object.entries(resourceTypesObj)
        .filter(([, v]) => v && typeof v === "object")
        .sort((a, b) => (b[1].count || 0) - (a[1].count || 0))
    : [];

  const chartData = {
    labels: ["Successful", "Failed", "Redirects"],
    datasets: [
      {
        data: [successfulCount, failedCount, redirectsCount],
        // Brand-aware, semantic colors
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)", // Successful - muted slate
          "rgba(239, 68, 68, 0.9)", // Failed - red
          "rgba(234, 179, 8, 0.9)", // Redirects - brand yellow
        ],
        borderColor: [
          "rgba(148, 163, 184, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(234, 179, 8, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = useMemo(() => {
    const ticks = isDark ? "rgba(255,255,255,0.78)" : "rgba(55,65,81,0.9)";
    const grid = isDark ? "rgba(255,255,255,0.10)" : "rgba(17,24,39,0.10)";

    return {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        legend: {
          ...commonOptions.plugins?.legend,
          labels: {
            ...(commonOptions.plugins?.legend?.labels || {}),
            color: ticks,
          },
        },
        tooltip: {
          ...commonOptions.plugins?.tooltip,
          backgroundColor: isDark ? "#111827" : "white",
          titleColor: isDark ? "#F9FAFB" : "#111827",
          bodyColor: isDark ? "#E5E7EB" : "#374151",
          borderColor: isDark ? "rgba(255,255,255,0.18)" : "#E5E7EB",
        },
      },
      // Pie doesn't use scales, but keeping grid color avoids regressions if chart.js expands config
      scales: commonOptions.scales
        ? commonOptions.scales
        : {
            x: { ticks: { color: ticks }, grid: { color: grid, drawBorder: false } },
            y: { ticks: { color: ticks }, grid: { color: grid, drawBorder: false } },
          },
    };
  }, [isDark]);

  return (
    <BaseCard
      id="network-requests"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Network Requests"
      icon={iconMapping["network-requests"]}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="h-[200px] w-full">
          <Pie data={chartData} options={chartOptions} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Requests</span>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Total:</span>
                <p> {totalRequestsCount}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Size:</span>
                <p> {(totalSizeBytes / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Total Time:</span>{" "}
                <p>{totalTimeMs.toFixed(2)}ms</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Redirects:</span>{" "}
                <p>{redirectsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {crossOriginHiddenCount > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-accent rounded-lg flex items-start gap-2">
            <RefreshCw className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium dark:text-foreground">
                Cross-origin excluded
              </p>
              <p className="text-sm text-muted-foreground">
                {crossOriginHiddenCount} resource(s) excluded from size totals
                (CORS)
              </p>
            </div>
          </div>
        )}

        {resourceTypeEntries.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">By resource type</p>
            <div className="space-y-2">
              {resourceTypeEntries.slice(0, 6).map(([type, stats]) => (
                <div
                  key={type}
                  className="p-3 bg-gray-50 dark:bg-accent rounded-lg space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-foreground">
                      {type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.count ?? 0} req
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Time</span>
                    <span>
                      {typeof stats.totalTime === "number"
                        ? `${stats.totalTime.toFixed(1)}ms`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size</span>
                    <span>
                      {typeof stats.totalSize === "number"
                        ? `${(stats.totalSize / 1024).toFixed(1)} KB`
                        : "—"}
                    </span>
                  </div>
                  {Array.isArray(stats.slowest) && stats.slowest.length > 0 && (
                    <div className="pt-2 border-t border-foreground/10">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Slowest
                      </div>
                      {stats.slowest.slice(0, 1).map((s, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-muted-foreground break-words"
                        >
                          {s?.name || "Unknown"}
                          {typeof s?.duration === "number"
                            ? ` (${Math.round(s.duration)}ms)`
                            : ""}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {failedCount > 0 && (
          <div className="p-3 bg-red-50 dark:bg-accent rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Failed Requests
              </p>
              <p className="text-sm text-red-600">
                {failedCount} requests failed
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
