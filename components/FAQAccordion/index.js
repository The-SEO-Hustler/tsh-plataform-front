import React, { useState, useRef, useEffect } from 'react';
import { cleanExcerpt } from "@/lib/wordpress/cleanExcerpt";
/**
 * Props:
 * @param {React.ReactNode} title - Optional block title
 * @param {React.ReactNode} description - Optional block description (HTML string)
 * @param {{ question: React.ReactNode; answer: React.ReactNode }[]} items - FAQ items
 */
export default function FAQAccordion({ title, description, items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-semibold mb-2 text-primary">{title}</h2>}
      {description && (
        <p className="text-base text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: cleanExcerpt(description) }} />
      )}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border-b overflow-hidden">
            <button
              className="w-full text-left py-3 px-4 font-medium focus:outline-none flex justify-between items-center cursor-pointer bg-primary text-black"
              onClick={() => toggleIndex(idx)}
            >
              <span>{item.question}</span>
              <span className="transform transition-transform duration-500">
                {openIndex === idx ? '-' : '+'}
              </span>
            </button>
            <div
              className="bg-white"
              style={{
                maxHeight: openIndex === idx ? '1000px' : '0px',
                transition: 'max-height 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <div className=" px-4 prose">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
