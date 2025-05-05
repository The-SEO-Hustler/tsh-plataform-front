"use client";

import React, { useState, useEffect, Suspense, useRef, Fragment, useMemo } from "react";
import Link from "next/link";
import Container from "@/components/container";
import { toast } from "sonner";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import LoadingScreenKeyword from "@/components/LoadingScreenKeyword";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Tag, ChevronRight, AlignLeft, BarChart2, CheckCircle, AlertTriangle, ExternalLink, ArrowRightLeft, Download } from 'lucide-react';
import TimestampDisplay from "@/components/TimestampDisplay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);
import { useTheme } from 'next-themes'

function AdvancedKeywordAnalysis() {

  const [keyword, setKeyword] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [extractingPageIntent, setExtractingPageIntent] = useState(false);
  const [searchIntentState, setSearchIntentState] = useState(false);
  const [googleTrendsState, setGoogleTrendsState] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [chartData, setChartData] = useState(null);
  const { resolvedTheme } = useTheme();
  const [selectedKeyword, setSelectedKeyword] = useState(analysisData?.related_keywords?.[0] || "");
  const listenerRef = useRef(null);
  const toastIds = useRef({
    searchIntent: null,
    googleTrends: null,
  });

  const { trackAdvancedKeywordAnalysis, currentAdvancedKeywordAnalysis, removeAdvancedKeywordAnalysis } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentAdvancedKeywordAnalysis ? currentAdvancedKeywordAnalysis.status : "initializing"
  );
  const [open, setOpen] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState(null)
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }
      },
      x: {
        grid: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', maxTicksLimit: 10 }
      }
    },
    plugins: {
      legend: { labels: { color: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' } },
      tooltip: {
        backgroundColor: resolvedTheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: resolvedTheme === 'dark' ? '#FFDD00' : '#000',
        bodyColor: resolvedTheme === 'dark' ? '#fff' : '#111',
      }
    }
  }), [resolvedTheme])
  const trendChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      x: {
        grid: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          maxTicksLimit: 10,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      tooltip: {
        backgroundColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        bodyColor: resolvedTheme === 'dark' ? '#fff' : '#000',
        titleColor: resolvedTheme === 'dark' ? '#FFDD00' : '#333',
      },
    },
  }), [resolvedTheme])

  const handleRowClick = (url) => {
    // only open if we have headings for that URL
    if (analysisData.headings_by_url[url]) {
      setSelectedUrl(url)
      setOpen(true)
    }
  }

  const [selectedUrls, setSelectedUrls] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)

  const toggleSelect = (url) => {
    setSelectedUrls((prev) =>
      prev.includes(url)
        ? prev.filter(u => u !== url)
        : [...prev, url]
    )
  }

  useEffect(() => {
    // Start tracking this analysis in the global context.

    if (docId) {
      trackAdvancedKeywordAnalysis(docId, keyword);
    }
  }, [docId, router, trackAdvancedKeywordAnalysis, keyword]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentAdvancedKeywordAnalysis && currentAdvancedKeywordAnalysis.type === "advanced-keyword-analysis") {
      setStatus(currentAdvancedKeywordAnalysis.status);
      setAnalysisData(currentAdvancedKeywordAnalysis.data || null);
      setSearchIntentState(currentAdvancedKeywordAnalysis.search_intent_state || false);
      setGoogleTrendsState(currentAdvancedKeywordAnalysis.google_trends_state || false);
      setSelectedKeyword(currentAdvancedKeywordAnalysis?.data?.related_keywords?.[0] || "");
      setKeyword(currentAdvancedKeywordAnalysis.keyword || "");
      setUpdatedAt(currentAdvancedKeywordAnalysis.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (
        currentAdvancedKeywordAnalysis.preview
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentAdvancedKeywordAnalysis.error) {
        setError(currentAdvancedKeywordAnalysis.error);

      }

    }
  }, [currentAdvancedKeywordAnalysis]);

  // Update chart data when selected keyword changes

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  }

  useEffect(() => {
    // Show loading toasts
    console.log('use effect toast ', searchIntentState, googleTrendsState, toastIds.searchIntent, toastIds.googleTrends)
    if (searchIntentState === "loading" && !toastIds.current.searchIntent) {
      toastIds.current.searchIntent = toast.loading(`Analyzing '${keyword}' search intent...`);
    }
    if (googleTrendsState === "loading" && !toastIds.current.googleTrends) {
      toastIds.current.googleTrends = toast.loading(`Analyzing '${keyword}' Google Trends...`);
    }

    // 2) dismiss on completion
    if (searchIntentState === "completed" && toastIds.current.searchIntent) {
      toast.dismiss(toastIds.current.searchIntent);
      toastIds.current.searchIntent = null;
    }
    if (googleTrendsState === "completed" && toastIds.current.googleTrends) {
      toast.dismiss(toastIds.current.googleTrends);
      toastIds.current.googleTrends = null;
    }
    // Cleanup on unmount (or before next effect run)
    return () => {
      if (toastIds.current.searchIntent) {
        toast.dismiss(toastIds.current.searchIntent)
        toastIds.current.searchIntent = null
      }
      if (toastIds.current.googleTrends) {
        toast.dismiss(toastIds.current.googleTrends)
        toastIds.current.googleTrends = null
      }
    }

  }, [googleTrendsState, searchIntentState])


  useEffect(() => {
    if (selectedKeyword?.monthly_searches) {
      // Sort the data by year and month
      const sortedData = [...selectedKeyword.monthly_searches].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      // Format the labels as 'Mon Year'
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const labels = sortedData.map(
        (item) => `${months[item.month - 1]} ${item.year}`,
      );

      // Extract the search volumes
      const searchVolumes = sortedData.map((item) => item.search_volume);

      // Create the chart data
      setChartData({
        labels,
        datasets: [
          {
            label: "Monthly Search Volume",
            data: searchVolumes,
            borderColor: "#FFDD00",
            backgroundColor: "rgba(255, 221, 0, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      });
    }
  }, [selectedKeyword]);

  const handleExtractPageIntent = async (url) => {
    // 1) Show loading toast and capture its ID
    const toastId = toast.loading("Extracting page intent...");
    setExtractingPageIntent(true);

    // 2) Set up a timeout to bail after 30s
    const timeoutId = setTimeout(() => {
      listenerRef.current?.();                   // unsubscribe
      listenerRef.current = null;
      toast.dismiss(toastId);                    // remove loader
      toast.info("Page intent extraction timed out.");
      setExtractingPageIntent(false);
    }, 30000);

    // 3) Start listening for the Firestore update
    listenerRef.current = onSnapshot(
      doc(db, "keywordAnalysis", docId),
      (docSnap) => {
        if (!docSnap.exists()) return;
        const data = docSnap.data()?.data || {};
        if (data.page_classifications?.[url]) {
          // Got our classification!
          clearTimeout(timeoutId);
          listenerRef.current?.();
          listenerRef.current = null;
          toast.success("Page intent extracted successfully", { id: toastId });
          setExtractingPageIntent(false);
        }
      },
      (error) => {
        // Handle listener errors
        clearTimeout(timeoutId);
        listenerRef.current?.();
        listenerRef.current = null;

        toast.dismiss(toastId);
        toast.error("Error listening for update.");
        console.error("Firestore listener error:", error);
        setExtractingPageIntent(false);
      }
    );

    // 4) Kick off the API call
    try {
      const response = await fetch("/api/extract-page-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, docId }),
      });
      const result = await response.json();
      console.log("Background job started:", result);
    } catch (err) {
      // If the POST itself fails, clean up immediately
      clearTimeout(timeoutId);
      listenerRef.current?.();
      listenerRef.current = null;
      toast.dismiss(toastId);
      toast.error("Failed to start extraction API.");
      console.error("Fetch error:", err);
      setExtractingPageIntent(false);
    }
  };


  // Function to get color based on intent type
  const getIntentColor = (intent) => {
    switch (intent) {
      case 'Commercial':
        return 'bg-blue-600';
      case 'Informational':
        return 'bg-green-600';
      case 'Navigational':
        return 'bg-purple-600';
      case 'Transactional':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };
  useEffect(() => {
    console.log('error effect', error)
    if (error) {
      console.log('removing analysis?')
      removeAdvancedKeywordAnalysis();
      if (toastIds.current.searchIntent) {
        toast.dismiss(toastIds.current.searchIntent);
        toastIds.current.searchIntent = null;
      }
      if (toastIds.current.googleTrends) {
        toast.dismiss(toastIds.current.googleTrends);
        toastIds.current.googleTrends = null;
      }
    }
  }, [error, removeAdvancedKeywordAnalysis, toastIds])

  // Function to render difficulty badge
  const getDifficultyBadge = (difficulty) => {
    if (difficulty <= 30) return <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold">Easy</span>;
    if (difficulty <= 60) return <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">Medium</span>;
    return <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">Hard</span>;
  };


  // Function to render heading structure in dialog
  const renderHeadings = (headings) => {
    if (!headings || headings.length === 0) {
      return <p className="text-foreground/80">No headings available for this URL.</p>;
    }

    return (
      <div className="space-y-2 mt-4">
        {headings.map((heading, index) => {
          // Style based on heading level
          const indentClass =
            heading.level === 'h1' ? 'ml-0 text-xl font-bold' :
              heading.level === 'h2' ? 'ml-4 text-lg font-semibold' :
                heading.level === 'h3' ? 'ml-8 text-base font-medium' :
                  heading.level === 'h4' ? 'ml-12 text-sm font-medium' :
                    heading.level === 'h5' ? 'ml-16 text-xs font-medium' : 'ml-20 text-xs';

          return (
            <div key={index} className={indentClass}>
              <div className="flex items-start">
                <span className="text-primary mr-2 font-mono">{heading.level}</span>
                <p>{heading.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  if (!docId) {
    router.push("/advanced-keyword-analysis");
  }
  if (error) {

    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-foreground/80">{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4 cursor-pointer">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }
  if (loadingPage) {
    return (
      <>
        <LoadingScreenKeyword status={status} docId={docId} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Header with Keyword Info */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#FFDD00"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container className=" relative z-10">
          <div className="flex items-center gap-1 md:gap-3 text-foreground/80 text-sm mb-4 flex-wrap gap-y-0">
            <span>
              <Link
                href="/advanced-keyword-analysis"
                className="hover:text-primary transition-colors text-white dark:text-foreground"
              >
                {" "}
                Advanced Keyword Analysis
              </Link>

            </span>
            <ChevronRight size={16} />
            <span className="text-primary font-semibold ">
              {analysisData.keyword || "New Content"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 text-white dark:text-foreground">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center ">
                {analysisData.keyword}
              </h1>
              <div className="flex gap-3 flex-col md:flex-row items-start md:items-center">
                {searchIntentState === "completed" ?
                  <>
                    <div
                      className={`${getIntentColor(analysisData.search_intent.primary)} whitespace-nowrap px-4 py-1 rounded-full text-white font-bold`}
                    >
                      {analysisData.search_intent.primary}
                    </div>
                    <span className="text-gray-300 dark:text-foreground/80">
                      {analysisData.search_intent.confidence}% Confidence
                    </span>
                  </> :
                  <>
                    <div
                      className={`whitespace-nowrap px-4 py-1 rounded-full text-transparent font-bold bg-gray-200 dark:bg-foreground/80 animate-pulse`}
                    >
                      loading intent
                    </div>
                    <span className="text-gray-300 dark:text-foreground/80">
                      Analyzing keyword search intent...
                    </span>
                  </>
                }
              </div>
              <div className="text-gray-300 dark:text-foreground/80 text-sm mt-2">
                <TimestampDisplay ts={updatedAt} />
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* Overview Metrics */}
      <section className="py-10 dark:bg-black bg-gray-200 border-b border-foreground/10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Volume */}
            <div className="bg-card rounded-lg p-6 border-l-4 border-primary hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 dark:text-foreground/80 text-sm uppercase mb-2 font-semibold">
                Search Volume
              </h3>
              <div className="text-3xl">
                {analysisData?.related_keywords[0]?.monthly_searches[0]?.search_volume > 0
                  ? <Fragment>
                    <div className="text-3xl font-black">{analysisData?.related_keywords[0]?.monthly_searches[0]?.search_volume.toLocaleString()}</div>
                    <div className="text-gray-400 dark:text-foreground/80 text-sm mt-2">{getMonthName(analysisData?.related_keywords[0]?.monthly_searches[0]?.month)} {analysisData?.related_keywords[0]?.monthly_searches[0]?.year}</div>
                  </Fragment>
                  : analysisData?.search_volume > 0
                    ? <Fragment>
                      <div className="text-3xl font-black">{analysisData?.search_volume.toLocaleString()}</div>
                      <div className="text-gray-400 dark:text-foreground/80 text-sm mt-2"> monthly searches</div>
                    </Fragment>
                    : "N/A"}
              </div>
            </div>

            {/* CPC */}
            <div className="bg-card rounded-lg p-6 border-l-4 border-blue-500 hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 dark:text-foreground/80 text-sm uppercase mb-2 font-semibold">
                CPC
              </h3>
              <div className="text-3xl font-black">
                {analysisData.cpc > 0
                  ? `$${analysisData.cpc.toFixed(2)}`
                  : "N/A"}
              </div>
              <p className="text-gray-400 dark:text-foreground/80 text-sm mt-2">Cost per click</p>
            </div>

            {/* Competition */}
            <div className="bg-card rounded-lg p-6 border-l-4 border-green-500 hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 dark:text-foreground/80 text-sm uppercase mb-2 font-semibold">
                Competition
              </h3>
              <div className="text-3xl font-black">
                {analysisData.competition ? analysisData.competition : "N/A"}
              </div>
              <p className="text-gray-400 dark:text-foreground text-sm mt-2">
                Competitive density
              </p>
            </div>

            {/* Difficulty */}
            <div className="bg-card rounded-lg p-6 border-l-4 border-red-500 hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 dark:text-foreground/80 text-sm uppercase mb-2 font-semibold">
                Difficulty
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black">
                  {analysisData.difficulty > 0
                    ? analysisData.difficulty
                    : "N/A"}
                </span>
                {analysisData.difficulty > 0 &&
                  getDifficultyBadge(analysisData.difficulty)}
              </div>
              <p className="text-gray-400 dark:text-foreground/80 text-sm mt-2">
                Ranking difficulty score
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Search Intent Section */}
      <section className="py-10 bg-background">
        <Container>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-primary text-black h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
              <Search size={16} />
            </span>
            Search Intent Analysis
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Primary Intent */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">Primary Intent</h3>
              {searchIntentState === "completed" ?
                <>
                  <div
                    className={`${getIntentColor(
                      analysisData.search_intent.primary
                    )} inline-block px-3 py-1 rounded-md text-white font-bold mb-3`}
                  >
                    {analysisData.search_intent.primary}
                  </div>

                  {/* Analysis Reasoning */}
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="mb-2 bg-card" >
                      <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-black  cursor-pointer">Summary</TabsTrigger>
                      <TabsTrigger value="reasoning" className="data-[state=active]:bg-primary data-[state=active]:text-black   cursor-pointer">Analysis Reasoning</TabsTrigger>

                    </TabsList>
                    <TabsContent value="reasoning">
                      <p className="text-foreground/80 ">
                        {analysisData.search_intent.reasoning}
                      </p>
                    </TabsContent>
                    <TabsContent value="summary">
                      <p className="text-foreground/80 ">
                        {analysisData.search_intent.summary}
                      </p>
                    </TabsContent>
                  </Tabs>
                </>
                :
                <>
                  <div
                    className={`whitespace-nowrap px-4 py-1 rounded-full text-transparent font-bold bg-gray-200 animate-pulse mb-3 block max-w-[200px]`}
                  >
                    loading intent
                  </div>
                  <span className="text-gray-300 mb-3 block">
                    Analyzing keyword search intent...
                  </span>
                  <div className="h-3 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
                  <div className="h-3 bg-gray-200 rounded-full max-w-[360px]"></div>

                </>
              }

            </div>

            {/* Intent Breakdown */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Intent Breakdown</h3>
              {searchIntentState === "completed" ?
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground/80">
                        Informational
                      </span>
                      <span className="text-sm font-medium dark:text-primary text-foreground/80">
                        {
                          analysisData.search_intent.intent_breakdown
                            .informational
                        }
                        %
                      </span>
                    </div>
                    <div className="w-full dark:bg-foreground/10 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${analysisData.search_intent.intent_breakdown.informational}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground/80">
                        Navigational
                      </span>
                      <span className="text-sm font-medium dark:text-primary text-foreground/80">
                        {
                          analysisData.search_intent.intent_breakdown
                            .navigational
                        }
                        %
                      </span>
                    </div>
                    <div className="w-full dark:bg-foreground/10 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${analysisData.search_intent.intent_breakdown.navigational}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground/80">
                        Commercial
                      </span>
                      <span className="text-sm font-medium dark:text-primary text-foreground/80">
                        {analysisData.search_intent.intent_breakdown.commercial}
                        %
                      </span>
                    </div>
                    <div className="w-full dark:bg-foreground/10 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${analysisData.search_intent.intent_breakdown.commercial}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground/80">
                        Transactional
                      </span>
                      <span className="text-sm font-medium dark:text-primary text-foreground/80">
                        {
                          analysisData.search_intent.intent_breakdown
                            .transactional
                        }
                        %
                      </span>
                    </div>
                    <div className="w-full dark:bg-foreground/10 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${analysisData.search_intent.intent_breakdown.transactional}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                :
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        Informational
                      </span>

                    </div>
                    <div className="w-full bg-gray-200 animate-pulse rounded-full h-2">
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        Navigational
                      </span>

                    </div>
                    <div className="w-full bg-gray-200 animate-pulse rounded-full h-2">

                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        Commercial
                      </span>

                    </div>
                    <div className="w-full bg-gray-200 animate-pulse rounded-full h-2">

                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        Transactional
                      </span>

                    </div>
                    <div className="w-full bg-gray-200 animate-pulse rounded-full h-2">

                    </div>
                  </div>
                </div>
              }
            </div>

            {/* PAA Questions */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">People Also Ask</h3>
              {/* {JSON.stringify(analysisData.paa_questions)} */}
              {analysisData.paa_questions &&
                analysisData.paa_questions.length > 0 ? (
                <ul className="space-y-3">
                  {analysisData.paa_questions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight
                        size={18}
                        className="text-primary mt-1 mr-2 flex-shrink-0"
                      />
                      <span className="text-foreground/80">{question}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/80">
                  No "People Also Ask" questions available for this keyword.
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>
      {/* {JSON.stringify(analysisData.page_classifications)} */}
      {/* Related Keywords & Search Volume Trend */}
      <section className="py-10 dark:bg-black bg-gray-200  text-foreground">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Related Keywords */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <Tag size={16} />
                </span>
                Related Keywords
              </h2>

              <div className="bg-card rounded-lg p-6">
                <div className="space-y-4 max-h-[370px] overflow-y-auto pr-2">
                  {analysisData?.related_keywords?.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedKeyword(keyword)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between cursor-pointer ${selectedKeyword.keyword === keyword.keyword
                        ? "bg-primary text-black"
                        : "bg-gray-200 dark:bg-accent hover:bg-accent/20 "
                        }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="text-xs opacity-80">
                          {keyword.monthly_searches[0]?.search_volume > 0 &&
                            `${keyword.monthly_searches[0]?.search_volume.toLocaleString()} searches`}
                        </div>
                      </div>

                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Volume Chart */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-primary text-black h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <BarChart2 size={16} />
                </span>
                Search Volume Trend
              </h2>

              <div className="bg-card rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">
                    {selectedKeyword?.keyword}
                  </h3>
                  <div className="flex  gap-3 mt-2 flex-col md:flex-row items-start md:items-center">
                    <span className="text-foreground/80">
                      {selectedKeyword?.search_volume} monthly searches
                    </span>

                    <span className=" text-sm px-2 py-1 bg-gray-200 dark:bg-accent rounded-md">
                      ${selectedKeyword?.cpc?.toFixed(2)} CPC
                    </span>
                    <div className={`text-foreground/80`}>
                      Competition: {selectedKeyword?.competition}
                    </div>
                  </div>
                </div>

                {chartData && chartData.labels.length > 0 ? (
                  <div className="h-72">
                    <Line
                      data={chartData}
                      options={options}

                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-72 bg-background rounded-lg">
                    <p className="text-foreground/80">Loading chart data...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-10 bg-background">
        <Container>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
              <Search size={16} />
            </span>
            Keyword overview
          </h2>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Key Topics */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Key Topics</h3>
              {searchIntentState === "completed" ?
                <div className="flex flex-wrap gap-2">
                  {analysisData.key_topics?.slice(0, 34).map((topic, index) => (
                    <span
                      key={index}
                      className="dark:bg-accent bg-gray-200 hover:bg-primary hover:text-black transition-colors px-3 py-1 rounded-md text-sm "
                    >
                      {topic}
                    </span>
                  ))}
                  {analysisData.key_topics?.length > 34 && (
                    <span className="text-foreground/80 text-sm mt-1">
                      +{analysisData.key_topics.length - 34} more topics
                    </span>
                  )}
                </div>
                :
                <>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-[70px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[90px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[45px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[70px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[90px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[45px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[70px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[90px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[45px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[70px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[90px] bg-gray-200 animate-pulse rounded-full h-6"></div>
                    <div className="w-[45px] bg-gray-200 animate-pulse rounded-full h-6"></div>

                  </div>
                  <p className="text-gray-400 mt-3">
                    Analyzing key topics...
                  </p>
                </>
              }
            </div>

            {/* User Needs */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">User Needs</h3>
              {searchIntentState === "completed" ?
                <ul className="space-y-3">
                  {analysisData.search_intent.user_needs?.map((need, index) => (
                    <li key={index} className="flex items-start mt-1 gap-3">
                      <span className="bg-primary text-primary-foreground p-1 rounded-full min-w-8 min-h-8 flex items-center justify-center ">✓</span>
                      <p className="text-foreground/80">{need}</p>
                    </li>
                  ))}
                </ul> :
                <p className="text-foreground/80">
                  Analyzing user needs...
                </p>
              }
            </div>

            {/* AI Overview Section */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">AI Overview</h3>


              {analysisData.ai_overview && analysisData.ai_overview.length > 0 ? (
                <div className="space-y-4">
                  {analysisData.ai_overview.slice(0, 1).map((item, index) => (
                    <div key={index} className="">
                      <p className="text-foreground/80 mb-3">{item.text}</p>
                      {item.references && item.references.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-foreground/80">References</p>
                          <div className="flex flex-wrap gap-2">
                            {item.references.map((ref, refIndex) => {
                              const url = new URL(ref.url);
                              return (

                                <a className="" href={ref.url} key={refIndex} target="_blank" rel="noopener noreferrer">

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2 border border-gray-700 rounded-md px-2 py-1">
                                          <img src={`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`} alt={ref.url} className="w-5 h-5 min-w-5 min-h-5 rounded-sm" />
                                          <span className=" text-foreground/80 text-sm">
                                            {url.hostname}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-card max-w-[300px] p-3 border-foreground/10">
                                        <div className="space-y-2">
                                          <h4 className="text-lg font-semibold text-foreground/80">{ref.title}</h4>
                                          <p className="text-foreground/80">{ref.text}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </a>
                              )
                              // <details key={refIndex} className="bg-[#2A2A2A] rounded-md p-3">
                              //   <summary className="cursor-pointer text-primary">{ref.url}</summary>
                              //   <div className="mt-2">
                              //     <h4 className="text-lg font-semibold text-white">{ref.title}</h4>
                              //     <p className="text-gray-400">{ref.text}</p>
                              //   </div>
                              // </details>
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/80">No AI Overview data available.</p>
              )}
            </div>
          </div>
        </Container>
      </section>



      {/* Google Trends Chart */}
      <section className="py-10 dark:bg-black bg-gray-200">
        <Container>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
              <BarChart2 size={16} />
            </span>
            Google Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">

              {googleTrendsState === "completed" ?
                <div className="bg-card rounded-lg p-6">
                  {analysisData.google_trends_data?.check_url && (
                    <a href={analysisData?.google_trends_data?.check_url} target="__blank" className="text-primary">View Google Trends</a>
                  )}
                  {analysisData?.google_trends_data && analysisData?.google_trends_data?.interestOverTime?.length > 0 ? (
                    <div className="h-72">
                      <Line
                        data={{
                          labels: analysisData?.google_trends_data?.interestOverTime?.map(item => new Date(item.date).toLocaleDateString()),
                          datasets: [
                            {
                              label: "Interest Over Time",
                              data: analysisData?.google_trends_data?.interestOverTime?.map(item => item.value),
                              borderColor: "#FFDD00",
                              backgroundColor: "rgba(255, 221, 0, 0.2)",
                              tension: 0.3,
                              fill: true,
                            },
                          ],
                        }}
                        options={trendChartOptions}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-72 bg-background rounded-lg">
                      <p className="text-foreground/80">Loading Google Trends data...</p>
                    </div>
                  )}
                </div>
                :
                <div className="flex items-center justify-center h-72 bg-background rounded-lg">
                  <div className="flex flex-col items-center justify-center bg-card animate-pulse w-full h-full rounded-lg p-4">
                    <p className="text-foreground/80">Loading Google Trends data...</p>
                  </div>
                </div>
              }
            </div>

            <div className="col-span-1">
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">People Also Search</h3>
                <div className="flex flex-col gap-2">
                  {analysisData?.related_searches && analysisData?.related_searches?.length > 0 ?
                    analysisData?.related_searches?.map((item, index) => (
                      <div key={index} className="text-foreground/80 flex items-center gap-2">
                        <a href={`https://www.google.com/search?q=${item}`} target="_blank" rel="noopener noreferrer" >
                          {item}
                        </a>
                        <ExternalLink size={12} />
                      </div>
                    ))
                    :
                    <div className="text-foreground/80">No related searches found.</div>
                  }
                </div>
              </div>
            </div>
          </div>

        </Container>
      </section>



      {/* SERP Analysis */}
      <section className="py-10 bg-background">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-primary text-primary-foreground min-h-8 min-w-8 rounded-full inline-flex items-center justify-center mr-3">
                <BarChart2 size={16} />
              </span>
              SERP Analysis
            </h2>
            {/* Compare button */}
            <div className="mb-4 flex items-center space-x-2">
              <Button
                onClick={() => setCompareOpen(true)}
                disabled={selectedUrls.length < 2}
                className="flex items-center space-x-2"
              >
                <ArrowRightLeft size={16} />
                <span>Compare {selectedUrls.length} Selected</span>
              </Button>
            </div>
          </div>



        </Container>
        <div className="max-w-[1450px] mx-auto md:px-6">
          {analysisData.serp_data && analysisData.serp_data.length > 0 ? (
            <div className="overflow-x-auto px-4 md:px-0">
              <table className="w-full">
                <thead className="bg-card border-b border-foreground/10">
                  <tr>
                    <th className="p-2" />
                    <th className="py-3 px-4 text-left text-sm font-semibold text-foreground/80">
                      Rank
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-foreground/80">
                      Title & URL
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-foreground/80">
                      Domain
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-foreground/80">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  {analysisData.serp_data.map((result, idx) => {

                    const headings = analysisData.headings_by_url?.[result.url] || false;
                    const url = result.url;
                    const isSelected = selectedUrls.includes(url);
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-card"} cursor-pointer`}
                        onClick={() => handleRowClick(result.url)}
                      >
                        {/* checkbox cell */}
                        <td className="p-2 text-center">
                          {headings && (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelect(url)}
                              disabled={
                                !isSelected && selectedUrls.length >= 3
                              }
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Select ${result.title} for comparison`}
                            />
                          )}
                        </td>
                        <td className="py-4 px-4 font-mono text-lg font-bold text-primary">
                          #{idx + 1}
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xl">
                            <div className="font-bold text-foreground mb-1 line-clamp-1 flex items-start gap-2">
                              <span className="text-foreground">
                                {result.title}
                              </span>
                              {searchIntentState === "completed" ?
                                analysisData.page_classifications?.[
                                result.url
                                ] && (
                                  <span
                                    className={`text-xs px-2 py-1 text-white rounded-full whitespace-nowrap ${getIntentColor(
                                      analysisData.page_classifications?.[
                                      result.url
                                      ],
                                    )}`}
                                  >
                                    {
                                      analysisData.page_classifications[
                                      result.url
                                      ]
                                    }
                                  </span>
                                )
                                :
                                <div className="w-[70px] bg-gray-200 animate-pulse rounded-full h-6"></div>

                              }
                            </div>
                            <div className="text-sm text-foreground/80 line-clamp-2">
                              {result.description}
                            </div>
                            <div className="text-xs text-green-500 mt-1">
                              {result.url}
                            </div>
                            {
                              result.links && result.links.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {result.links.map((link) => (
                                    <a key={link.url} href={link.url} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="text-xs border border-foreground/20 rounded-lg px-2 py-1 !no-underline hover:bg-foreground/10 hover:text-foreground transition-colors">
                                      {link.title}
                                    </a>
                                  ))}
                                </div>
                              )
                            }
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground/80">
                          {result.domain}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2 justify-end">
                            {/* just an icon indicator; clicking it still opens the dialog */}
                            {searchIntentState === "completed" ?

                              headings ? (
                                <button
                                  className="bg-card hover:bg-primary hover:text-primary-foreground text-foreground/80 p-2 rounded-md transition-colors cursor-pointer border border-foreground/10"
                                  title="View Headings"
                                >
                                  <AlignLeft size={16} />
                                </button>
                              ) : (
                                <button className="bg-card hover:bg-primary hover:text-primary-foreground text-foreground/80 p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-foreground/10"
                                  title="Extract page Intent"
                                  disabled={extractingPageIntent}
                                  onClick={() => handleExtractPageIntent(result.url)}
                                >
                                  <Download size={16} />
                                </button>
                              ) :
                              <div className=" bg-gray-200 animate-pulse rounded-md p-2"> <AlignLeft size={16} /></div>
                            }

                            {/* this link should NOT open the dialog */}
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-card hover:bg-primary hover:text-primary-foreground text-foreground/80 p-2 rounded-md transition-colors border border-foreground/10"
                              title="Visit Page"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* single Dialog instance */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-card text-foreground border-foreground/10">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <AlignLeft className="text-primary" size={20} />
                      Headings Structure
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-2 max-h-[500px] overflow-y-auto">
                    <div className="text-sm text-foreground/80 mb-4">
                      {selectedUrl}
                    </div>
                    {selectedUrl &&
                      renderHeadings(
                        analysisData.headings_by_url[selectedUrl],
                      )}
                  </div>
                </DialogContent>
              </Dialog>
              {/* 3) Comparison Dialog */}
              <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
                <DialogContent className="bg-card text-foreground border-foreground/10 md:!max-w-2xl lg:!max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      <AlignLeft className="text-primary" size={20} />
                      Heading Structure Comparison
                    </DialogTitle>
                  </DialogHeader>
                  <div
                    className={`grid grid-cols-2 lg:grid-cols-${selectedUrls.length} gap-3 mt-2 max-h-[500px] overflow-y-auto `}
                  >
                    {selectedUrls.map((url) => (
                      <div
                        key={url}
                        className="border p-4 rounded border-foreground/10"
                      >
                        <h3 className="font-bold mb-2 line-clamp-1 text-primary">
                          {url}
                        </h3>
                        {renderHeadings(analysisData.headings_by_url[url])}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              <AlertTriangle
                size={48}
                className="text-yellow-500 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2">
                No SERP Data Available
              </h3>
              <p className="text-foreground/80 max-w-md mx-auto">
                We couldn't find any search engine results for this keyword.
                This might be due to very low search volume or a highly
                specific query.
              </p>
            </div>
          )}
        </div>
      </section>



      {/* Action Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary">
        <Container>
          <h2 className="text-3xl font-black text-primary-foreground mb-6 text-center">
            Ready to Dominate Search Results?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto mb-8 text-center">
            Use this keyword analysis to create content that ranks. Our SEO
            tools help you cut through the noise and focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="ghost"
              size="lg"
              href="/advanced-keyword-analysis"
            >
              Explore More Keywords
            </Button>
            <Button size="lg" variant="secondary" disabled={true} className="cursor-not-allowed">
              Get the Full Report
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function AdvancedKeywordAnalysisPage() {
  return (
    <Suspense>
      <AdvancedKeywordAnalysis />
    </Suspense>
  );
}
