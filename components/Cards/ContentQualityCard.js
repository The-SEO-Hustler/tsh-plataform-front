import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { FileText } from "lucide-react";

// Color is now more conservative: only very dense/technical content is red.
const fleschColor = (score) => {
  if (score >= 50) return "text-green-700 dark:text-green-300";
  if (score >= 30) return "text-amber-700 dark:text-amber-300";
  return "text-red-700 dark:text-red-300";
};

const fleschBarWidth = (score) => `${Math.max(0, Math.min(100, score))}%`;

export default function ContentQualityCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  const {
    wordCount = 0,
    paragraphCount = 0,
    avgWordsPerSentence = 0,
    readingTimeMinutes = 0,
    fleschKincaidScore = 0,
    fleschReadingEase = "",
    hasAuthor,
    hasPublicationDate,
    longestSentences = [],
  } = data || {};

  const chipOn =
    "bg-green-100/80 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800/40";
  const chipOff =
    "bg-muted text-muted-foreground border border-foreground/10 dark:border-foreground/15";

  return (
    <BaseCard
      id="contentQuality"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Content Quality"
      icon={iconMapping["contentQuality"] || FileText}
      analysis={analysis}
    >
      {/* {JSON.stringify({ data, status, analysis }, null, 2)} */}
      <div className="space-y-2.5 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/40 dark:bg-muted/30 rounded-md p-2 text-center border border-foreground/10">
            <div className="font-bold text-lg">
              {wordCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">words</div>
          </div>
          <div className="bg-muted/40 dark:bg-muted/30 rounded-md p-2 text-center border border-foreground/10">
            <div className="font-bold text-lg">{readingTimeMinutes}</div>
            <div className="text-xs text-muted-foreground">min read</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">Reading level</span>
            <span
              className={`text-xs font-medium ${fleschColor(fleschKincaidScore)}`}
            >
              {fleschKincaidScore} — {fleschReadingEase || "N/A"}
            </span>
          </div>
          <div className="h-1.5 bg-muted/60 dark:bg-muted/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                fleschKincaidScore >= 50
                  ? "bg-green-500"
                  : fleschKincaidScore >= 30
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: fleschBarWidth(fleschKincaidScore) }}
            />
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Avg words/sentence</span>
            <span>{avgWordsPerSentence}</span>
          </div>
          <div className="flex justify-between">
            <span>Paragraphs</span>
            <span>{paragraphCount}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1 border-t border-foreground/10">
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${hasAuthor ? chipOn : chipOff}`}
          >
            {hasAuthor ? "Author ✓" : "No author"}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${hasPublicationDate ? chipOn : chipOff}`}
          >
            {hasPublicationDate ? "Date ✓" : "No date"}
          </span>
        </div>

        {Array.isArray(longestSentences) && longestSentences.length > 0 && (
          <div className="mt-2 pt-2 border-t border-foreground/10 space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-foreground text-xs">
              Longest sentences you might simplify:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              {longestSentences.map((sentence, index) => (
                <li
                  key={index}
                  className="italic line-clamp-3"
                  title={sentence}
                >
                  {sentence}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
