import React from "react";
import { Bar } from "react-chartjs-2";
import { Code } from "lucide-react";
import BaseCard from "./BaseCard";
import { commonOptions } from "@/app/lib/commonOptions";

export default function HeadingsCard({
  data,
  status,
  isFocused,
  onFocus,
  description,
}) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Count",
        data: data.map((d) => d.count),
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
      icon={Code}
      description={description}
    >
      <div className="w-full h-[200px] mt-4">
        <Bar data={chartData} options={commonOptions} />
      </div>
    </BaseCard>
  );
}
