import React from 'react';
import UsageCard from "@/components/usageCard";


export default function ToolsLayout({ children }) {


  return (
    <div className="reslative">
      {children}
      <UsageCard />
    </div>
  );
}