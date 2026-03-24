import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Gauge } from "lucide-react";

const metricColor = (s) =>
  s === "good"
    ? "text-green-600"
    : s === "needs-improvement"
      ? "text-amber-600"
      : "text-red-600";

const metricBg = (s) =>
  s === "good"
    ? "bg-green-100 text-green-700"
    : s === "needs-improvement"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

const normalizeStatus = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "good" || s === "normal") return "good";
  if (s === "needs-improvement" || s === "needs improvement" || s === "warning")
    return "needs-improvement";
  if (s === "poor" || s === "error" || s === "bad") return "poor";
  return "";
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const deriveStatus = (value, threshold) => {
  if (value === null || !threshold) return "";
  const good = toNumber(threshold.good);
  const poor = toNumber(threshold.poor);
  if (good === null || poor === null) return "";
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
};

const normalizeMetric = (metric, fallbackUnit = "") => {
  if (metric == null) return null;

  // New/old object formats
  if (typeof metric === "object") {
    const value = toNumber(metric.value ?? metric.score ?? metric.metricValue);
    const unit = metric.unit || fallbackUnit;
    const threshold =
      metric.threshold && typeof metric.threshold === "object"
        ? metric.threshold
        : null;
    const normalizedStatus =
      normalizeStatus(metric.status) || deriveStatus(value, threshold);

    return {
      value,
      unit,
      threshold,
      status: normalizedStatus || "needs-improvement",
    };
  }

  // Legacy primitive value format
  const value = toNumber(metric);
  if (value === null) return null;
  return {
    value,
    unit: fallbackUnit,
    threshold: null,
    status: "needs-improvement",
  };
};

const formatValue = (value, label) => {
  if (value === null) return "—";
  if (label === "CLS")
    return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return Number.isInteger(value) ? value : value.toFixed(1);
};

function MetricRow({ label, metric }) {
  if (!metric) return null;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={metricColor(metric.status)}>
          {formatValue(metric.value, label)}
          {metric.unit}
        </span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${metricBg(metric.status)}`}
        >
          {metric.status === "needs-improvement" ? "Needs work" : metric.status}
        </span>
      </div>
    </div>
  );
}

export default function CoreWebVitalsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const lcpMetric = normalizeMetric(data?.lcp, " ms");
  const clsMetric = normalizeMetric(data?.cls, "");
  const fidMetric = normalizeMetric(data?.fid, " ms");
  const ttfbMetric = normalizeMetric(data?.ttfb, " ms");
  const tbtMetric = normalizeMetric(data?.tbt, " ms");

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
        <MetricRow label="LCP" metric={lcpMetric} />
        <MetricRow label="CLS" metric={clsMetric} />
        <MetricRow label="FID" metric={fidMetric} />
        <MetricRow label="TTFB" metric={ttfbMetric} />
        <MetricRow label="TBT" metric={tbtMetric} />
        <div className="pt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
          <span>
            Thresholds: LCP &lt;2.5s · CLS &lt;0.1 · FID &lt;200ms · TTFB
            &lt;800ms · TBT &lt;600ms
          </span>
        </div>
      </div>
    </BaseCard>
  );
}
