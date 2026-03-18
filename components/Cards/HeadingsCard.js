import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Code } from "lucide-react";
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

  const chartData = {
    labels: ["h3", "h4", "h5", "h6"],
    datasets: [
      {
        label: "Count",
        data: [data.h3.count, data.h4.count, data.h5.count, data.h6.count],
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
        },
      },
    };
  }, [isDark]);

  return (
    <BaseCard
      id="headings"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Headings Structure"
      icon={iconMapping.headings}
      analysis={`H3: ${analysis.h3} | H4: ${analysis.h4} | H5: ${analysis.h5} | H6: ${analysis.h6} `}
    >
      <div className="w-full h-[200px] mt-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </BaseCard>
  );
}
