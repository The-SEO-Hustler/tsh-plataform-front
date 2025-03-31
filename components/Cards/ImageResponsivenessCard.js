import React from "react";
import BaseCard from "./BaseCard";
import { ImageIcon } from "lucide-react";

export default function ImageResponsivenessCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { totalImages, score, details } = data;

  return (
    <BaseCard
      id="image-responsiveness"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Image Responsiveness"
      icon={ImageIcon}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Images: <span className="font-medium">{totalImages}</span>
          </div>
          <div className="text-sm">
            Score:{" "}
            <span
              className={`font-medium ${
                score >= 8
                  ? "text-green-600"
                  : score >= 5
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {score}/10
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {details.map((detail, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Ratio: {detail.ratio}
                </span>
                <span
                  className={`text-sm font-medium ${
                    detail.score >= 8
                      ? "text-green-600"
                      : detail.score >= 5
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Score: {detail.score}/10
                </span>
              </div>
              <img src={detail.src} />
              <p className="text-sm text-gray-600">{detail.message}</p>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}
