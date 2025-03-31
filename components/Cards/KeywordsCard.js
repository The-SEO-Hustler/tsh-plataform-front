import React from "react";
import { Bar } from "react-chartjs-2";
import { commonOptions } from "@/app/lib/commonOptions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Gauge } from "lucide-react";
import BaseCard from "./BaseCard";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function KeywordsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const chartData = {
    labels: data.map((d) => d.keyword),
    datasets: [
      {
        label: "Count",
        data: data.map((d) => d.count),
        backgroundColor: "#82ca9d",
      },
    ],
  };

  return (
    <BaseCard
      id="keywords"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Top Keywords"
      icon={Gauge}
      analysis={analysis}
    >
      <div className="w-full h-[200px] mt-4">
        <Bar data={chartData} options={commonOptions} />
      </div>
    </BaseCard>
  );
}
