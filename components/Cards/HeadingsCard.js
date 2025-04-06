import React from "react";
import { Bar } from "react-chartjs-2";
import { Code } from "lucide-react";
import BaseCard from "./BaseCard";
import { commonOptions } from "@/lib/commonOptions";
import { iconMapping } from "@/lib/config";
export default function HeadingsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
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
        <Bar data={chartData} options={commonOptions} />
      </div>
    </BaseCard>
  );
}
