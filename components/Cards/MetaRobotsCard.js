import React from "react";
import { Lock } from "lucide-react";
import BaseCard from "./BaseCard";

export default function MetaRobotsCard({
  data,
  status,
  isFocused,
  onFocus,
  analysis,
}) {
  return (
    <BaseCard
      id="metaRobots"
      status={status}
      isFocused={isFocused}
      onFocus={onFocus}
      title="Meta Robots / Directives"
      icon={Lock}
      analysis={analysis}
    >
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b">
            <td className="py-2">Index</td>
            <td className="text-right py-2">{data.index}</td>
          </tr>
          <tr>
            <td className="py-2">Follow</td>
            <td className="text-right py-2">{data.follow}</td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  );
}
