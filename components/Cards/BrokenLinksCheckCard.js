import React, { useState } from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
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

  const brokenLinks = data?.brokenLinks ?? [];
  const non200Links = data?.non200Links ?? [];
  const unverifiableLinks = data?.unverifiableLinks ?? [];
  const specialLinks = data?.specialLinks ?? [];

  const displayedBrokenLinks = showAll
    ? brokenLinks
    : brokenLinks.slice(0, 5);
  const displayedNon200Links = showAll
    ? non200Links
    : non200Links.slice(0, 5);
  const displayedUnverifiableLinks = showAll
    ? unverifiableLinks
    : unverifiableLinks.slice(0, 5);
  const displayedSpecialLinks = showAll
    ? specialLinks
    : specialLinks.slice(0, 5);

  const getLinkLabel = (link) =>
    link?.anchor || link?.ariaLabel || link?.title || link?.url || link?.href || "Unnamed link";

  const chartData = {
    labels: ["Internal Links", "External Links"],
    datasets: [
      {
        data: [data?.internalLinks ?? 0, data?.externalLinks ?? 0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)", // Blue for internal
          "rgba(75, 192, 192, 0.8)", // Green for external
        ],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
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
            <span className="text-blue-500 dark:text-blue-500">
              {data?.totalLinks ?? 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Internal Links:</span>
            <span className="text-green-700 dark:text-green-500">
              {data?.internalLinks ?? 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>External Links:</span>
            <span className="text-blue-500 dark:text-blue-500">
              {data?.externalLinks ?? 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Non-HTTP Links:</span>
            <span className="text-yellow-600">{data?.nonhttpLinks ?? 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Broken Links:</span>
            <span
              className={`${status === "error" ? "text-red-500" : status === "warning" ? "text-yellow-500" : "text-green-700 dark:text-green-500"}`}
            >
              {brokenLinks.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Non-200 Links:</span>
            <span className="text-amber-600 dark:text-amber-500">
              {non200Links.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Unverifiable Links:</span>
            <span className="text-orange-600 dark:text-orange-500">
              {unverifiableLinks.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Special Links (tel/mailto):</span>
            <span className="text-violet-600 dark:text-violet-500">
              {specialLinks.length}
            </span>
          </div>

          {brokenLinks.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-red-500">Broken Links:</span>
              <ul className="mt-1 space-y-1">
                {displayedBrokenLinks.map((link, index) => (
                  <li key={index} className="break-words">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getLinkLabel(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {non200Links.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-yellow-700">
                Non-200 Status Links:
              </span>
              <ul className="mt-1 space-y-1">
                {displayedNon200Links.map((link, index) => (
                  <li key={index} className="break-words">
                    <span className="inline-block text-xs mr-2 px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      {link?.status ?? "N/A"}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getLinkLabel(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {unverifiableLinks.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-orange-700 dark:text-orange-400">
                Unverifiable Links:
              </span>
              <ul className="mt-1 space-y-1">
                {displayedUnverifiableLinks.map((link, index) => (
                  <li key={index} className="break-words">
                    <span className="inline-block text-xs mr-2 px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                      {link?.status || "Unverifiable"}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getLinkLabel(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {specialLinks.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-violet-700 dark:text-violet-400">
                Special Links:
              </span>
              <ul className="mt-1 space-y-1">
                {displayedSpecialLinks.map((link, index) => (
                  <li key={index} className="break-words">
                    <span className="inline-block text-xs mr-2 px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                      {(link?.href || "").startsWith("mailto:")
                        ? "mailto"
                        : (link?.href || "").startsWith("tel:")
                          ? "tel"
                          : "special"}
                    </span>
                    <span className="font-medium">{getLinkLabel(link)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(brokenLinks.length > 5 ||
            non200Links.length > 5 ||
            unverifiableLinks.length > 5 ||
            specialLinks.length > 5) && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-accent hover:bg-gray-100 dark:hover:bg-accent/80 rounded-lg transition-colors duration-200 mt-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 dark:text-foreground" />
                  <span className="text-sm font-medium dark:text-foreground">
                    Show Less
                  </span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 dark:text-foreground" />
                  <span className="text-sm font-medium dark:text-foreground">
                    Show{" "}
                    {Math.max(
                      brokenLinks.length - 5,
                      non200Links.length - 5,
                      unverifiableLinks.length - 5,
                      specialLinks.length - 5,
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
