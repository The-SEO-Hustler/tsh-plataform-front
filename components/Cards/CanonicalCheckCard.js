import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Link, CheckCircle, XCircle } from "lucide-react";

function StatusRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      {value ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
}

export default function CanonicalCheckCard({ data, status, isFocused, onFocus, analysis }) {
  const { present, canonicalUrl, currentUrl, isSelfReferencing, isAbsolute } = data || {};

  return (
    <BaseCard
      id="canonicalCheck"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Canonical Tag"
      icon={iconMapping["canonicalCheck"] || Link}
      analysis={analysis}
    >
      <div className="space-y-2">
        <StatusRow label="Tag present" value={present} />
        <StatusRow label="Absolute URL" value={isAbsolute} />
        <StatusRow label="Self-referencing" value={isSelfReferencing} />
        {canonicalUrl && (
          <div className="pt-1 text-xs text-muted-foreground break-all border-t border-foreground/10">
            <span className="font-medium">Canonical: </span>{canonicalUrl}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
