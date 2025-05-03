import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Gauge, ChevronDown, ChevronUp } from "lucide-react";
import BaseCard from "./BaseCard";
import { commonOptions } from "@/lib/commonOptions";
import { iconMapping } from "@/lib/config";

export default function KeywordAnalysisCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedKeywords = showAll
    ? data.keywordUsage
    : data.keywordUsage.slice(0, 3);

  const chartData = {
    labels: data.topKeywords.map((k) => k.word),
    datasets: [
      {
        label: "Count",
        data: data.topKeywords.map((k) => k.count),
        backgroundColor: "#8884d8",
      },
    ],
  };

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
          <Bar data={chartData} options={commonOptions} />
        </div>
        {data.keywordUsage && data.keywordUsage.length > 0 && (
          <div>
            <span className="font-medium">Keyword Usage:</span>
            <ul className="mt-1 space-y-1">
              {displayedKeywords.map((keyword, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{keyword.word}</span>
                  <span className="text-gray-500">
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
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm font-medium ">Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-sm font-medium ">
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
