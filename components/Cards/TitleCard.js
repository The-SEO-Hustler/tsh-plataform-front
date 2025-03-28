import React from 'react';
import { Type } from 'lucide-react';
import BaseCard from './BaseCard';

export default function TitleCard({ data, status, isFocused, onFocus, description }) {
  return (
    <BaseCard
      id="title"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Page Title"
      icon={Type}
      description={description}
    >
      <div className="space-y-2 text-sm">
        <div className="break-words">
          <span className="font-medium">Title:</span> {data.value}
        </div>
        <div className="flex justify-between items-center">
          <span>Length:</span>
          <span className={`${data.length > 60 ? 'text-yellow-500' : 'text-green-500'}`}>
            {data.length} characters
          </span>
        </div>
      </div>
    </BaseCard>
  );
} 