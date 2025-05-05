import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { commonOptions } from "@/lib/commonOptions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function JsExecutionTimeCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    totalScripts,
    totalScriptTime,
    averageScriptTime,
    longTasks,
    totalLongTaskTime,
    jsErrors
  } = data;

  const chartData = {
    labels: ['Total Scripts', 'Long Tasks', 'JS Errors'],
    datasets: [
      {
        label: 'Count',
        data: [totalScripts, longTasks, jsErrors],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <BaseCard
      id="js-execution-time"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="JavaScript Execution Time"
      icon={iconMapping["js-execution-time"]}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="h-[200px] w-full">
          <Bar data={chartData} options={commonOptions} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Script Timing</span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Total Time:</span> {totalScriptTime.toFixed(2)}ms</p>
              <p><span className="font-medium">Average Time:</span> {averageScriptTime.toFixed(2)}ms</p>
            </div>
          </div>

          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Long Tasks</span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Count:</span> {longTasks}</p>
              <p><span className="font-medium">Total Time:</span> {totalLongTaskTime.toFixed(2)}ms</p>
            </div>
          </div>
        </div>

        {jsErrors > 0 && (
          <div className="p-3 bg-red-50 dark:bg-accent rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">JavaScript Errors</p>
              <p className="text-sm text-red-600">{jsErrors} errors detected</p>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
} 