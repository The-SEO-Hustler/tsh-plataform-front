"use client";

import React, { useState, useEffect } from "react";
import { X, DollarSign, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CostDisplay = ({ evaluationCost }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVercelUser, setIsVercelUser] = useState(false);

  useEffect(() => {
    const toolbarSelector = [
      "nextjs-portal",
      "vercel-live-feedback",
      "nextjs-portal-toolbar",
      "#vercel-toolbar",
      "iframe[src*=\"_vercel\"][title=\"Vercel\"]"
    ].join(",");

    if (typeof document !== "undefined" && document.querySelector(toolbarSelector)) {
      setIsVercelUser(true);
    }
  }, []);

  if (!isVercelUser || !evaluationCost) {
    return null;
  }

  const formatCost = (cost) => {
    return (
      <div className="text-xs">
        <pre className="whitespace-pre-wrap break-words text-muted-foreground">
          {JSON.stringify(cost, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full p-0 shadow-lg bg-primary text-primary-foreground"
        variant="outline"
        size="sm"
      >
        <DollarSign className="h-4 w-4" />
      </Button>

      {/* Cost Display Panel */}
      {isVisible && (
        <Card className="fixed bottom-16 right-4 z-50 w-80 max-h-96 shadow-xl border overflow-auto max-w-[90%] gap-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Evaluation Cost
              </CardTitle>
              <div className="flex items-center gap-1">

                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>


          <CardContent className="pt-0">
            <div className="space-y-2">
              {formatCost(evaluationCost)}
            </div>
          </CardContent>

        </Card>
      )}
    </>
  );
};

export default CostDisplay; 