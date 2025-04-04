import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/app/seo-audit/config";
import { Download, AlertCircle, RefreshCw } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { commonOptions } from "@/app/lib/commonOptions";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function NetworkRequestsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    totalRequests,
    totalSize,
    totalTime,
    failedRequests,
    redirects
  } = data;

  const chartData = {
    labels: ['Successful', 'Failed', 'Redirects'],
    datasets: [
      {
        data: [
          totalRequests - failedRequests - redirects,
          failedRequests,
          redirects
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <BaseCard
      id="network-requests"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Network Requests"
      icon={iconMapping["network-requests"]}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="h-[200px] w-full">
          <Pie data={chartData} options={commonOptions} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Requests</span>
            </div>
            <div >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Total:</span><p> {totalRequests}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Size:</span><p> {(totalSize / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Total Time:</span> <p>{totalTime.toFixed(2)}ms</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Redirects:</span> <p>{redirects}</p>
              </div>
            </div>
          </div>


        </div>

        {failedRequests > 0 && (
          <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Failed Requests</p>
              <p className="text-sm text-red-600">{failedRequests} requests failed</p>
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
} 