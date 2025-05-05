import React, { useState, useRef, useEffect } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { commonOptions } from "@/lib/commonOptions";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function BrokenLinksCheckCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedBrokenLinks = showAll
    ? data.brokenLinks
    : data.brokenLinks.slice(0, 5);
  const displayedNon200Links = showAll
    ? data.non200Links
    : data.non200Links.slice(0, 5);

  const chartData = {
    labels: ['Internal Links', 'External Links', 'Non-HTTP Links'],
    datasets: [
      {
        data: [data.internalLinks, data.externalLinks, data.nonhttpLinks],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Blue for internal
          'rgba(75, 192, 192, 0.8)',  // Green for external
          'rgba(255, 206, 86, 0.8)',  // Yellow for non-http
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  return (
    <BaseCard
      id="brokenLinksCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Broken Links Check"
      icon={iconMapping.brokenLinksCheck}
      analysis={analysis}
    >
      <div className="space-y-4">
        {/* Pie Chart */}
        <div className="h-[200px] w-full">
          <Pie data={chartData} options={commonOptions} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Total Links:</span>
            <span className="text-blue-500 dark:text-blue-500">{data.totalLinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Internal Links:</span>
            <span className="text-green-700 dark:text-green-500">{data.internalLinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>External Links:</span>
            <span className="text-blue-500 dark:text-blue-500">{data.externalLinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Non-HTTP Links:</span>
            <span className="text-yellow-600">{data.nonhttpLinks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Broken Links:</span>
            <span className={`${status === 'error' ? 'text-red-500' : status === 'warning' ? 'text-yellow-500' : 'text-green-700 dark:text-green-500'}`}>{data.brokenLinks.length}</span>
          </div>
          {data.brokenLinks && data.brokenLinks.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-red-500">Broken Links:</span>
              <ul className="mt-1 space-y-1">
                {displayedBrokenLinks.map((link, index) => (
                  <li key={index} className="break-words">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">

                      {link.anchor}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.non200Links && data.non200Links.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-yellow-700">
                Non-200 Status Links:
              </span>
              <ul className="mt-1 space-y-1">
                {displayedNon200Links.map((link, index) => (
                  <li key={index} className="break-words">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">

                      {link.anchor}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(data.brokenLinks.length > 5 || data.non200Links.length > 5) && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-accent/80 rounded-lg transition-colors duration-200 mt-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium ">
                    Show Less
                  </span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium ">
                    Show{" "}
                    {Math.max(
                      data.brokenLinks.length - 5,
                      data.non200Links.length - 5
                    )}{" "}
                    More
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
