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
  Eye,
  EyeOff,
  LayoutGrid,
  Rows2,
  Search,
  BookOpen,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "@/components/PDFReport";
import { Input } from "@/components/ui/input";
import { useFirebase } from "@/lib/firebase-context";
import Link from "next/link";
import { getScoreAppearance } from "../lib/getScoreAppearance";
function SEOAudit() {
  const [focusedCardId, setFocusedCardId] = useState(null);
  const [analysisData, setAnalysisData] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [updatedAt, setUpdatedAt] = useState('');
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
  const [searchQuery, setSearchQuery] = useState('');
  const { trackAnalysis, currentAnalysis } = useFirebase();
  const [status, setStatus] = useState(currentAnalysis ? currentAnalysis.status : 'initializing');


  useEffect(() => {
    if (!docId) {
      router.push("/");
      return;
    }
    // Start tracking this analysis in the global context.
    // You can pass an initial URL if needed.

    trackAnalysis(docId, url);
  }, [docId, router, trackAnalysis, url]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentAnalysis) {
      setStatus(currentAnalysis.status);
      setAnalysisData(currentAnalysis.data || []);
      setUrl(currentAnalysis.url || "");
      setScore(currentAnalysis.score || 0);
      setUpdatedAt(currentAnalysis.updatedAt || "");
      // Stop loading when analysis is completed or failed.
      if (currentAnalysis.status === "completed" || currentAnalysis.status === "failed") {
        setLoading(false);
      } else {
        setLoading(true);
      }
      if (currentAnalysis.error) {
        setError(currentAnalysis.error);
      }
    }
  }, [currentAnalysis]);


  const handleExportReport = () => {
    // Export JSON
    const exportData = {
      timestamp: new Date().toISOString(),
      score: 75,
      cards: analysisData,
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

  const filterDataBySearch = (data) => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(item => {
      // Check if the type contains the query
      if (item.type.toLowerCase().includes(query)) return true;

      // Check if the analysis contains the query
      // if (item.analysis && item.analysis.toLowerCase().includes(query)) return true;

      // Check if any data properties contain the query
      if (item.data) {
        // For objects, check if any string values contain the query
        if (typeof item.data === 'object') {
          return Object.values(item.data).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(query)
          );
        }
      }

      return false;
    });
  };

  const filteredData = filterDataBySearch(
    analysisData.filter(card => statusFilters[card.status || 'normal'])
  );



  const scoreAppearance = getScoreAppearance(score);
  const ScoreIcon = scoreAppearance.icon;

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
    return (
      <LoadingScreen status={status} docId={docId} />

    );
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
            data={filteredData}
            statusFilters={statusFilters}
          />
        </div>
        <div className="py-4 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-5 md:gap-2 md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${scoreAppearance.gradient} flex items-center justify-center shadow-lg`}>
                  <ScoreIcon className="w-8 h-8 text-white" />
                </div>
                <div className={`absolute -bottom-3 ${scoreAppearance.bgColor} rounded-full px-3 py-1 text-sm font-bold border ${scoreAppearance.borderColor} shadow-sm ${scoreAppearance.textColor}`}>
                  {score ? score : 'N/A'}/100
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {url}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Last updated: {updatedAt ? new Date(updatedAt.seconds * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export JSON</span>
              </button>
              <PDFDownloadLink
                document={<PDFReport data={analysisData} score={75} />}
                fileName={`seo-report-${new Date().toLocaleDateString()}.pdf`}
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export PDF</span>
              </PDFDownloadLink>


            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg sticky top-1 border border-gray-300 shadow-sm z-[10]">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="lg:flex items-center gap-2 hidden">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">

                <div className="hidden md:flex gap-2">
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
                <div className="flex items-center md:gap-4 gap-2">
                  <div className="flex items-center space-x-1 md:space-x-2">
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

                  <div className="flex items-center space-x-1 md:space-x-2">
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

                  <div className="flex items-center space-x-1 md:space-x-2">
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
            className={`gap-2.5 grid ${layout === "grid"
              ? "xl:grid-cols-4  lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
              : "grid-cols-1 max-w-[700px] m-auto"
              } `}
          >
            {filteredData.map((card, index) => {
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
