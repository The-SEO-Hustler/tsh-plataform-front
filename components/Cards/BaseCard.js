import React from "react";
import s from "@/components/SeoCheck/styles.module.css";

const statusClasses = {
  // Keep a neutral background; use borders/headings for status
  error: `${s.cardError}`,
  warning: `${s.cardWarning}`,
  normal: `${s.cardNormal}`,
};

export default function BaseCard({
  id,
  status,
  isFocused,
  onFocus,
  title,
  icon: Icon,
  children,
  analysis,
  className = "",
}) {
  return (
    <div
      className={`${s.card} ${statusClasses[status]} ${
        isFocused ? s.focused : ""
      } ${className} bg-card text-foreground md:max-h-[600px] md:min-h-[600px] overflow-y-auto rounded-lg pr-2 
  [&::-webkit-scrollbar]:w-1.5 
  [&::-webkit-scrollbar-track]:bg-transparent 
  [&::-webkit-scrollbar-thumb]:bg-white/10 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  hover:[&::-webkit-scrollbar-thumb]:bg-white/20`}
      id={id}
    >
      <div>
        <div
          className={`flex items-center gap-3 pb-3 mb-3 border-b border-foreground/10 ${s.cardHeading}`}
        >
          <Icon className="w-5 h-5" />
          <h3 className="font-semibold ">{title}</h3>
        </div>
        {children}
      </div>
      <p
        className={`mt-2 text-sm  text-wrap word-break-all  overflow-hidden truncate ${s.cardDescription}`}
      >
        {analysis}
      </p>
    </div>
  );
}
