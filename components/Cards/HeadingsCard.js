import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import BaseCard from "./BaseCard";
import { commonOptions } from "@/lib/commonOptions";
import { iconMapping } from "@/lib/config";
import { useTheme } from "next-themes";

export default function HeadingsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Safely fallback to 0 in case the backend payload is missing a tier
  const chartData = {
    labels: ["H1", "H2", "H3", "H4", "H5", "H6"],
    datasets: [
      {
        label: "Count",
        data: [
          data?.h1?.count || 0,
          data?.h2?.count || 0,
          data?.h3?.count || 0,
          data?.h4?.count || 0,
          data?.h5?.count || 0,
          data?.h6?.count || 0,
        ],
        backgroundColor: "#8884d8",
      },
    ],
  };

  const chartOptions = useMemo(() => {
    const grid = isDark ? "rgba(255,255,255,0.10)" : "rgba(17,24,39,0.10)";
    const ticks = isDark ? "rgba(255,255,255,0.78)" : "rgba(17,24,39,0.75)";
    const legend = ticks;

    return {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        legend: {
          ...commonOptions.plugins?.legend,
          labels: {
            ...(commonOptions.plugins?.legend?.labels || {}),
            color: legend,
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
      scales: {
        x: {
          ticks: { color: ticks },
          grid: { color: grid, drawBorder: false },
        },
        y: {
          ticks: { color: ticks },
          grid: { color: grid, drawBorder: false },
          // Force the Y-axis to start at 0 so the bars don't look disjointed
          beginAtZero: true,
        },
      },
    };
  }, [isDark]);
  // Safety check: If the backend sends the old object structure (cached data),
  // format it into a string. Otherwise, use the new string directly.
  const safeAnalysis =
    typeof analysis === "object" && analysis !== null
      ? `H3: ${analysis.h3?.count || analysis.h3} | H4: ${analysis.h4} | H5: ${analysis.h5} | H6: ${analysis.h6}`
      : analysis;

  return (
    <BaseCard
      id="headings"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Headings Structure"
      icon={iconMapping.headings}
      analysis={safeAnalysis}
    >
      {/* REMOVED: The JSON.stringify debug block that was leaking into the UI */}

      <div className="w-full h-[200px] mt-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </BaseCard>
  );
}
