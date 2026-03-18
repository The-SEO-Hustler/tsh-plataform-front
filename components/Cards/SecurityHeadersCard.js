import React from "react";
import BaseCard from "./BaseCard";
import { iconMapping } from "@/lib/config";
import { Shield } from "lucide-react";

const HEADER_LABELS = {
  "x-content-type-options": "X-Content-Type-Options",
  "x-frame-options": "X-Frame-Options",
  "content-security-policy": "Content-Security-Policy",
  "strict-transport-security": "Strict-Transport-Security (HSTS)",
  "referrer-policy": "Referrer-Policy",
  "permissions-policy": "Permissions-Policy",
};

export default function SecurityHeadersCard({ data, status, isFocused, onFocus, analysis }) {
  const { isHttps, headers = {}, presentCount = 0, missingHeaders = [] } = data || {};

  const total = Object.keys(HEADER_LABELS).length;

  return (
    <BaseCard
      id="securityHeaders"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Security Headers"
      icon={iconMapping["securityHeaders"] || Shield}
      analysis={analysis}
    >
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2">
          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${isHttps ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {isHttps ? "HTTPS ✓" : "HTTP only"}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${presentCount >= 4 ? "bg-green-100 text-green-700" : presentCount >= 2 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
            {presentCount}/{total} headers
          </div>
        </div>

        <div className="space-y-1">
          {Object.entries(HEADER_LABELS).map(([key, label]) => {
            const present = headers[key] === true;
            return (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className={present ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                <span className={`font-medium ${present ? "text-green-600" : "text-red-500"}`}>
                  {present ? "✓" : "✗"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </BaseCard>
  );
}
