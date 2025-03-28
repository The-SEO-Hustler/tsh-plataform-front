import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Gauge } from 'lucide-react';
import BaseCard from './BaseCard';
import { commonOptions } from '@/app/lib/commonOptions';

export default function KeywordAnalysisCard({ data, status, isFocused, onFocus, description }) {
  const chartData = {
    labels: data.topKeywords.map((k) => k.word),
    datasets: [
      {
        label: 'Count',
        data: data.topKeywords.map((k) => k.count),
        backgroundColor: '#8884d8',
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
      icon={Gauge}
      description={description}
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
              {data.keywordUsage.map((keyword, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{keyword.word}</span>
                  <span className="text-gray-500">
                    {keyword.count} ({keyword.percentage})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
} 