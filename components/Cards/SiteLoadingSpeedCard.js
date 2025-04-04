import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";
import { Clock, AlertCircle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { commonOptions } from "@/app/lib/commonOptions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SiteLoadingSpeedCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    loadTime,
    domContentLoaded,
    firstContentfulPaint,
    firstMeaningfulPaint,
    largestContentfulPaint,
    timeToInteractive,
    totalBlockingTime,
    speedIndex
  } = data;

  const chartData = {
    labels: ['Load Time', 'DOM Content', 'First Paint', 'Largest Paint', 'Time to Interactive'],
    datasets: [
      {
        label: 'Time (ms)',
        data: [
          loadTime,
          domContentLoaded,
          firstContentfulPaint,
          largestContentfulPaint,
          timeToInteractive
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const getPerformanceStatus = (value, thresholds) => {
    if (value <= thresholds.good) return { color: 'text-green-600', label: 'Good' };
    if (value <= thresholds.needsImprovement) return { color: 'text-amber-600', label: 'Needs Improvement' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  const lcpStatus = getPerformanceStatus(largestContentfulPaint, { good: 2500, needsImprovement: 4000 });
  const ttiStatus = getPerformanceStatus(timeToInteractive, { good: 3800, needsImprovement: 7300 });
  const tbtStatus = getPerformanceStatus(totalBlockingTime, { good: 300, needsImprovement: 600 });

  return (
    <BaseCard
      id="site-loading-speed"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Site Loading Speed"
      icon={iconMapping["site-loading-speed"]}
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
              <span className="text-sm font-medium">Core Metrics</span>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Largest Contentful Paint:</span>{" "}
                <span className={lcpStatus.color}>
                  {largestContentfulPaint.toFixed(0)}ms ({lcpStatus.label})
                </span>
              </p>
              <p>
                <span className="font-medium">Time to Interactive:</span>{" "}
                <span className={ttiStatus.color}>
                  {timeToInteractive.toFixed(0)}ms ({ttiStatus.label})
                </span>
              </p>
              <p>
                <span className="font-medium">Total Blocking Time:</span>{" "}
                <span className={tbtStatus.color}>
                  {totalBlockingTime.toFixed(0)}ms ({tbtStatus.label})
                </span>
              </p>
            </div>
          </div>

          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Additional Metrics</span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">First Contentful Paint:</span> {firstContentfulPaint.toFixed(0)}ms</p>
              <p><span className="font-medium">First Meaningful Paint:</span> {firstMeaningfulPaint.toFixed(0)}ms</p>
              <p><span className="font-medium">Speed Index:</span> {speedIndex.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {status === 'error' && (
          <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Measurement Error</p>
              <p className="text-sm text-red-600">{analysis}</p>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
} 