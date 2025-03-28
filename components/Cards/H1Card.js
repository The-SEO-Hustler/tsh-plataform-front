import React from 'react';
import { Heading1 } from 'lucide-react';
import BaseCard from './BaseCard';

export default function H1Card({ data, status, isFocused, onFocus, description }) {
  return (
    <BaseCard
      id="h1"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="H1 Tags"
      icon={Heading1}
      description={description}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total H1 Tags:</span>
          <span className={data.length > 1 ? 'text-yellow-500' : 'text-green-500'}>
            {data.length}
          </span>
        </div>
        <div className="mt-2">
          <span className="font-medium">H1 Values:</span>
          <ul className="mt-1 space-y-1">
            {data.values.map((value, index) => (
              <li key={index} className="break-words">
                {value || '(empty)'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseCard>
  );
} 