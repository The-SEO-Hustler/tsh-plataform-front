import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Gauge, ChevronDown, ChevronUp } from "lucide-react";
import BaseCard from "./BaseCard";
import { commonOptions } from "@/lib/commonOptions";
import { iconMapping } from "@/lib/config";
import { useTheme } from "next-themes";

export default function KeywordAnalysisCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const displayedKeywords = showAll
    ? data.keywordUsage
    : data.keywordUsage.slice(0, 3);

  const chartData = {
    labels: data.topKeywords.map((k) => k.word),
    datasets: [
      {
        label: "Count",
        data: data.topKeywords.map((k) => k.count),
        backgroundColor: "rgba(234, 179, 8, 0.85)", // brand yellow
        borderColor: "rgba(234, 179, 8, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = useMemo(() => {
    const grid = isDark ? "rgba(255,255,255,0.10)" : "rgba(17,24,39,0.10)";
    const ticks = isDark ? "rgba(255,255,255,0.78)" : "rgba(17,24,39,0.75)";
    const legend = isDark ? "rgba(255,255,255,0.78)" : "rgba(55,65,81,0.9)";

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
      id="keywordAnalysis"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Keyword Analysis"
      icon={iconMapping.keywordAnalysis}
      analysis={analysis}
    >
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Total Words:</span>
            <span className="ml-2">{data.totalWords}</span>
          </div>
          <div>
            <span className="font-medium">Unique Words:</span>
            <span className="ml-2">{data.uniqueWords}</span>
          </div>
        </div>
        <div className="w-full h-[200px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
        {data.keywordUsage && data.keywordUsage.length > 0 && (
          <div>
            <span className="font-medium">Keyword Usage:</span>
            <ul className="mt-1 space-y-1">
              {displayedKeywords.map((keyword, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-foreground dark:text-foreground/80">
                    {keyword.word}
                  </span>
                  <span className="text-gray-500 dark:text-foreground">
                    {keyword.count} ({keyword.percentage})
                  </span>
                </li>
              ))}
            </ul>
            {data.keywordUsage.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-accent/80 rounded-lg transition-colors duration-200 mt-2"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 dark:text-foreground" />
                    <span className="text-sm font-medium dark:text-foreground">
                      Show Less
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 dark:text-foreground" />
                    <span className="text-sm font-medium dark:text-foreground">
                      Show {data.keywordUsage.length - 3} More
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
