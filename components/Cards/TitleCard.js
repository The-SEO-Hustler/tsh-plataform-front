import React from "react";
import BaseCard from "./BaseCard";
import { FileText } from "lucide-react";

export default function TitleCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { value, length } = data;

  return (
    <BaseCard
      id="title"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Title Tag"
      icon={FileText}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between ">
          <span className="text-sm text-gray-600">Title Length:</span>
          <span
            className={` ${length > 60 ? "text-red-600" : "text-green-600"}`}
          >
            {length} characters
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Title Content:</h4>
          <div className="">
            <p className="text-sm text-gray-600">{value}</p>
          </div>
        </div>

        <div className="">
          <div className="text-sm text-gray-600">
            {length > 60
              ? "Title is too long. Google typically displays 50-60 characters."
              : "Title length is within recommended limits."}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
