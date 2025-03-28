import React from 'react';
import { Image } from 'lucide-react';
import BaseCard from './BaseCard';

export default function ImageAltCard({ data, status, isFocused, onFocus, description }) {
  return (
    <BaseCard
      id="image-alt"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Image Alt Text"
      icon={Image}
      description={description}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span>Total Images:</span>
          <span className="text-blue-500">{data.totalImages}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Images with Alt:</span>
          <span className="text-green-500">{data.imagesWithAlt}</span>
        </div>
        {data.imagesWithoutAlt && data.imagesWithoutAlt.length > 0 && (
          <div className="mt-2">
            <span className="font-medium text-yellow-500">Images Without Alt Text:</span>
            <ul className="mt-1 space-y-1">
              {data.imagesWithoutAlt.map((image, index) => (
                <li key={index} className="break-words">
                  {image}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseCard>
  );
} 