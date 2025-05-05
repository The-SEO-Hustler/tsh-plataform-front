import React from "react";
import { Map } from "lucide-react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
export default function SitemapCheckCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="sitemapCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Sitemap Check"
      icon={iconMapping.sitemapCheck}
      analysis={analysis}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Found in Robots.txt:</span>
          <span
            className={
              data.foundInRobots ? "text-green-700 dark:text-green-500" : "text-yellow-700 "
            }
          >
            {data.foundInRobots ? "Yes ✓" : "No ✕"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Total URLs:</span>
          <span className="text-blue-500">{data.totalUrls}</span>
        </div>
        {data.sitemaps && data.sitemaps.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">Sitemaps:</span>
            <ul className="mt-1 space-y-1">
              {data.sitemaps.map((sitemap, index) => (
                <li key={index} className="break-words mb-2">
                  <div className="flex justify-between items-center truncate">
                    <span>{sitemap.url}</span>
                  </div>
                  <span className="text-gray-500">Level {sitemap.level}</span>
                  <div className="text-xs text-gray-500">
                    URLs: {sitemap.urlCount}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
