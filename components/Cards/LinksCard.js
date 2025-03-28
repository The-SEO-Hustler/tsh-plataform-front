import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Share2 } from "lucide-react";
import BaseCard from "./BaseCard";
import { commonOptions } from "@/app/lib/commonOptions";
// Register required components for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function LinksCard({
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
        label: "Links",
        data: data.map((d) => d.value),
        backgroundColor: COLORS,
      },
    ],
  };

  return (
    <BaseCard
      id="links"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Links Distribution"
      icon={Share2}
      description={description}
    >
      <div className="w-full h-[200px] mt-4">
        <Pie data={chartData} options={commonOptions} />
      </div>
    </BaseCard>
  );
}
