'use client'
import React, { useState, useRef, useEffect } from 'react';
import { cleanExcerpt } from "@/lib/wordpress/cleanExcerpt";
/**
 * Props:
 * @param {React.ReactNode} title - Optional block title
 * @param {React.ReactNode} description - Optional block description (HTML string)
 * @param {{ question: React.ReactNode; answer: React.ReactNode }[]} items - FAQ items
 */
export default function FAQAccordion({ title = "", description, items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };
  //id for title in toc
  const titleText = title?.[1] || "";
  const titleId = titleText.replaceAll(" ", "-").replaceAll("'", "").replaceAll(":", "").replaceAll('"', '').replaceAll(".", "").replaceAll(",", "").replaceAll("!", "").replaceAll("?", "").replaceAll("(", "").replaceAll(")", "").replaceAll("'", "").replaceAll(":", "").replaceAll('"', '');
  console.log('title here: ', title)
  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-semibold mb-2 text-primary" id={titleId}>{title}</h2>}
      {description && (
        <p className="text-base text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: cleanExcerpt(description) }} />
      )}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const questionText = item.question?.[1] || "";
          const questionId = questionText.replaceAll(" ", "-").replaceAll("'", "").replaceAll(":", "").replaceAll('"', '').replaceAll(".", "").replaceAll(",", "").replaceAll("!", "").replaceAll("?", "").replaceAll("(", "").replaceAll(")", "").replaceAll("'", "").replaceAll(":", "").replaceAll('"', '');
          return (
            <div key={idx} className="border-b overflow-hidden rounded-md" id={questionId} style={{ scrollMarginTop: '64px' }} >
              <button
                className="w-full text-left py-3 px-4 font-medium rounded-md focus:outline-2 flex justify-between items-center cursor-pointer bg-primary dark:bg-accent text-primary-foreground dark:text-foreground"
                onClick={() => toggleIndex(idx)}
              >
                <h3 className="!py-0 !my-0 font-semibold !text-primary-foreground dark:!text-foreground" >{item.question}</h3>
                <span className="transform transition-transform duration-500 text-lg">
                  {openIndex === idx ? '-' : '+'}
                </span>
              </button>
              <div
                className="bg-card text-foreground"
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
          )
        })}
      </div>
    </div>
  );
}
