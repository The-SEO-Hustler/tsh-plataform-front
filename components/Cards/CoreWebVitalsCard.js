import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Gauge } from "lucide-react";

const metricColor = (s) =>
  s === "good" ? "text-green-600" : s === "needs-improvement" ? "text-amber-600" : "text-red-600";

const metricBg = (s) =>
  s === "good" ? "bg-green-100 text-green-700" : s === "needs-improvement" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";

function MetricRow({ label, value, unit = "", metric }) {
  if (!metric) return null;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={metricColor(metric.status)}>
          {value}{unit}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${metricBg(metric.status)}`}>
          {metric.status === "needs-improvement" ? "Needs work" : metric.status}
        </span>
      </div>
    </div>
  );
}

export default function CoreWebVitalsCard({ data, status, isFocused, onFocus, analysis }) {
  const { lcp, cls, fid, ttfb } = data || {};

  return (
    <BaseCard
      id="coreWebVitals"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Core Web Vitals"
      icon={iconMapping["coreWebVitals"] || Gauge}
      analysis={analysis}
    >
      <div className="space-y-2.5">
        <MetricRow label="LCP" value={lcp?.value ?? "—"} unit=" ms" metric={lcp} />
        <MetricRow label="CLS" value={cls?.value ?? "—"} unit="" metric={cls} />
        <MetricRow label="FID" value={fid?.value ?? "—"} unit=" ms" metric={fid} />
        <MetricRow label="TTFB" value={ttfb?.value ?? "—"} unit=" ms" metric={ttfb} />
        <div className="pt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
          <span>Thresholds: LCP &lt;2.5s · CLS &lt;0.1 · FID &lt;200ms · TTFB &lt;800ms</span>
        </div>
      </div>
    </BaseCard>
  );
}
