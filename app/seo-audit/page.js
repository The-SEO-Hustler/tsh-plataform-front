"use client";

import React, { useState, useEffect, Suspense } from "react";
import Container from "@/components/container";
import s from "./style.module.css";
import Sidebar from "@/components/sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { cardComponents } from "./config";
import {
  Download,
  RefreshCw,
  Award,
  Settings,
  Eye,
  EyeOff,
  LayoutGrid,
  LayoutPanelLeft,
  LayoutPanelTop,
  Rows2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

function SEOAudit() {
  const [focusedCardId, setFocusedCardId] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id");
  const [statusFilters, setStatusFilters] = useState({
    normal: true,
    warning: true,
    error: true,
  });
  const [alwaysShowTooltips, setAlwaysShowTooltips] = useState(false);
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    if (!docId) {
      router.push("/");
      return;
    }

    // Listen for changes to the document
    const unsubscribe = onSnapshot(doc(db, "seoAnalyses", docId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();

        if (data.status === "completed") {
          setAnalysisData(data.data);
          setLoading(false);
          unsubscribe();
        } else if (data.status === "failed") {
          setError(data.error || "Analysis failed. Please try again.");
          setLoading(false);
          unsubscribe();
        } else {
          // Status is 'pending'
          setLoading(true);
        }
      } else {
        setError("Analysis document not found");
        setLoading(false);
        unsubscribe();
      }
    });
    // Optionally, implement a timeout to auto-unsubscribe after a period of inactivity
    const timeout = setTimeout(() => {
      setError("Timeout");
      unsubscribe();
    }, 600000); // 600 seconds timeout, adjust as needed

    return () => unsubscribe();
  }, [docId, router]);

  const handleExportReport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      score: 75,
      cards: mockData, // This comes from your config.js
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-report-${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <div
        className={`${s.overlay} ${focusedCardId ? s.active : ""}`}
        onClick={() => setFocusedCardId(null)}
      ></div>
      <div className={s.dashboard}>
        <div className="">
          <Sidebar
            setFocusedCardId={setFocusedCardId}
            alwaysShowTooltips={alwaysShowTooltips}
            data={analysisData}
            statusFilters={statusFilters}
          />
        </div>
        <div className="py-4">
          {/* Header */}
          <div className="flex flex-col gap-5 md:gap-2 md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-3 bg-white rounded-full px-2 py-1 text-sm font-bold border shadow-sm">
                  75/100
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  SEO Analysis Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors pointer"
              >
                <Download className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors pointer">
                <RefreshCw className="w-4 h-4" />
                Refresh Analysis
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="lg:flex items-center gap-2 hidden">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Display Settings</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setLayout("grid")}
                    aria-label="grid layout"
                    className="cursor-pointer"
                  >
                    <LayoutGrid
                      size={22}
                      color={layout === "grid" ? "black" : "gray"}
                    />
                  </button>
                  <button
                    className="cursor-pointer"
                    aria-label="row layout"
                    onClick={() => setLayout("row")}
                  >
                    <Rows2
                      size={22}
                      color={layout === "row" ? "black" : "gray"}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className="cursor-pointer"
                      id="normal"
                      checked={statusFilters.normal}
                      onCheckedChange={() => handleFilterChange("normal")}
                    />
                    <label
                      htmlFor="normal"
                      className="flex cursor-pointer items-center gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-600"></span>
                      Normal
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="warning"
                      className="cursor-pointer"
                      checked={statusFilters.warning}
                      onCheckedChange={() => handleFilterChange("warning")}
                    />
                    <label
                      htmlFor="warning"
                      className="flex cursor-pointer items-center gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Warning
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className="cursor-pointer"
                      id="error"
                      checked={statusFilters.error}
                      onCheckedChange={() => handleFilterChange("error")}
                    />
                    <label
                      htmlFor="error"
                      className="flex items-center cursor-pointer gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Error
                    </label>
                  </div>
                </div>

                <div className="hidden md:block md:border-l md:pl-4">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start !pl-0 gap-2 h-auto p-0 hover:bg-transparent"
                    onClick={() => setAlwaysShowTooltips((prev) => !prev)}
                  >
                    {alwaysShowTooltips ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      Always Show Tooltips
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div
            className={`gap-2.5 grid ${
              layout === "grid"
                ? "xl:grid-cols-4  lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
                : "grid-cols-1 max-w-[700px] m-auto"
            } `}
          >
            {analysisData
              .filter((card) => statusFilters[card.status])
              .map((card, index) => {
                const CardComponent = cardComponents[card.type];
                console.log("search for card: ", card.type, CardComponent);
                if (!CardComponent) return null;

                return (
                  <CardComponent
                    key={card.type}
                    data={card.data}
                    status={card.status}
                    isFocused={focusedCardId === card.type}
                    onFocus={setFocusedCardId}
                    analysis={card.analysis}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function SEOAuditPage() {
  return (
    <Suspense>
      <SEOAudit />
    </Suspense>
  );
}
