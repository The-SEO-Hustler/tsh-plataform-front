import React from "react";
import s from "@/components/SeoCheck/styles.module.css";

const statusClasses = {
  error: `!bg-red-100/90  hover:bg-red-200  ${s.cardError}`,
  warning: `!bg-yellow-100/90  hover:bg-yellow-200  ${s.cardWarning}`,
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
      className={`${s.card} ${statusClasses[status]} ${isFocused ? s.focused : ""
        } ${className} bg-card text-foreground`}
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
