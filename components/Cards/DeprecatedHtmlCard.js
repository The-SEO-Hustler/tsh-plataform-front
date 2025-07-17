import React from "react";
import BaseCard from "./BaseCard";
import { AlertTriangle } from "lucide-react";

export default function DeprecatedHtmlCard({
  data,
  status,
  analysis,
  onFocus,
  isFocused,
}) {
  const { hasDeprecated, count, elements } = data;

  return (
    <BaseCard
      id="deprecatedHtml"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Deprecated HTML Check"
      icon={AlertTriangle}
      analysis={analysis}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
          <span className="text-sm dark:text-foreground">
            Deprecated Elements Found:
          </span>
          <span className="font-medium dark:text-foreground">{count}</span>
        </div>

        {elements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Deprecated Elements:
            </h4>
            <div className="space-y-2">
              {elements.map((element, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-accent rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5 dark:text-foreground" />
                    <p className="text-sm dark:text-foreground">{element?.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}
