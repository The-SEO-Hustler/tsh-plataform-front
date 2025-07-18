"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { ChevronRight, FileText, User, Target, CheckCircle, ExternalLink, Gauge, BarChart2, Users, Globe, Lightbulb, BookOpen, ShoppingCart, Navigation } from 'lucide-react';

import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";

function SearchIntent({ blogPosts }) {
  const [keyword, setKeyword] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [url, setUrl] = useState("");
  const [sendToEmail, setSendToEmail] = useState(false);
  const { trackAnalysis, currentAnalysis, clearAnalysis } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentAnalysis ? currentAnalysis.status : "initializing"
  );


  useEffect(() => {
    // Start tracking this analysis in the global context.

    if (docId) {
      trackAnalysis({
        type: "search-intent",
        docId: docId,
        collection: "searchIntent",
        meta: {
          keyword: keyword,
        }
      });
    }
  }, [docId, router, trackAnalysis, keyword]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentAnalysis && currentAnalysis.type === "search-intent") {
      setStatus(currentAnalysis.status);
      setAnalysisData(currentAnalysis.data || null);
      setKeyword(currentAnalysis.keyword || "");
      setUrl(currentAnalysis.url || "");
      setSendToEmail(currentAnalysis.sendToEmail || false);
      setUpdatedAt(currentAnalysis.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (currentAnalysis.preview) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentAnalysis.error) {
        setError(currentAnalysis.error);
      }
    }
  }, [currentAnalysis]);




  // Function to get color based on intent type
  const getIntentColor = (intent) => {
    switch (intent) {
      case "Informational":
        return "bg-green-600";
      case "Commercial":
        return "bg-blue-600";
      case "Navigational":
        return "bg-purple-600";
      case "Transactional":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  // Function to get intent icon
  const getIntentIcon = (intent) => {
    switch (intent) {
      case "Informational":
        return <BookOpen size={16} />;
      case "Commercial":
        return <ShoppingCart size={16} />;
      case "Navigational":
        return <Navigation size={16} />;
      case "Transactional":
        return <ShoppingCart size={16} />;
      default:
        return <Target size={16} />;
    }
  };

  // Function to get score color and description
  const getScoreInfo = (score) => {
    if (score >= 8) return { color: "text-green-400", bg: "bg-green-600", desc: "Excellent" };
    if (score >= 6) return { color: "text-blue-400", bg: "bg-blue-600", desc: "Good" };
    if (score >= 4) return { color: "text-yellow-400", bg: "bg-yellow-600", desc: "Average" };
    return { color: "text-red-400", bg: "bg-red-600", desc: "Needs Improvement" };
  };

  const scoreInfo = getScoreInfo(analysisData?.urlReport?.score);

  // Loading skeleton components
  const QuerySummarySkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const PrimaryIntentSkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mr-3 animate-pulse"></div>
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
      <div className="pt-4 border-t border-foreground/10">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const URLScoreSkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center mb-4">
        <div className="text-4xl font-black mr-4 w-16 h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div>
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse mb-1"></div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mb-4">
        <div className="bg-gray-400 dark:bg-gray-600 h-3 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
      <div className="h-4 w-80 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );

  const IntentBreakdownSkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <div className="mb-3">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="h-8 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gray-400 dark:bg-gray-600 h-2 rounded-full animate-pulse" style={{ width: `${Math.random() * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserNeedsSkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
        <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <ul className="space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex items-start">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full mr-3 mt-1 shrink-0 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </li>
        ))}
      </ul>
    </div>
  );

  const PageClassificationsSkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-foreground/10">
            <div className="flex-1 min-w-0">
              <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ml-3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SuggestionsSkeleton = () => (
    <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start p-4 rounded-lg border border-foreground/10">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 shrink-0 mt-0.5 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };



  // If no docId, show the form
  if (!docId) {
    router.push("/search-intent");
  }

  // If there's an error, show the error screen
  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-foreground">{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // If loading and status is initializing, show the loading screen
  if (loadingPage) {
    return (
      <>
        <LoadingScreen status={status} type="search-intent" docId={docId} collection="searchIntent" sendToEmail={sendToEmail} blogPosts={blogPosts} />
      </>
    );
  }

  // If we have data, show the content planning results
  return (
    <div className="min-h-screen pb-14 bg-background text-foreground">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-background to-[#ffcc0070] dark:from-[#4e503a] dark:to-background py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDD00" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container className=" relative z-10">
          <div className="flex items-center gap-3 text-foreground/80 text-sm mb-4">
            <span><Link href="/search-intent" className="hover:text-primary transition-colors"> Search Intent</Link></span>
            <ChevronRight size={16} />
            <span className="text-primary font-bold">New Search Intent</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                {keyword || 'New Search Intent'}
              </h1>


              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-white dark:bg-black text-black dark:text-foreground px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <FileText size={14} className="mr-1" />
                  {url || 'Unknown URL'}
                </span>

                <span className="bg-white dark:bg-black text-black dark:text-foreground px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <Target size={14} className="mr-1" />
                  Keyword: {keyword || 'None'}
                </span>
                {/* {JSON.stringify(analysisData)} */}
              </div>
            </div>


          </div>
        </Container>
      </div>
      <section className="py-12 bg-background border-t border-foreground/10">
        <Container>

          <div className="space-y-8">
            {/* Query Summary */}

            <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <Target className="text-primary mr-3" size={24} />
                  Analysis Results
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-foreground/80 mr-2">Status:</span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-foreground/80 mr-2">Confidence:</span>
                    {(!analysisData?.intent?.confidence && (status !== 'completed') && (status !== 'failed')) ?
                      <span className="text-transparent font-bold block bg-gray-200 dark:bg-gray-400 rounded-full text-sm animate-pulse">80%</span>
                      :
                      <span className="text-primary font-bold">{analysisData?.intent.confidence}%</span>
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-foreground/80 text-sm">Keyword:</span>
                  <p className="font-bold text-lg">{keyword}</p>
                </div>
                <div>
                  <span className="text-foreground/80 text-sm">Target URL:</span>
                  <p className="font-medium text-blue-400 dark:text-primary truncate">{url}</p>
                </div>
              </div>
            </div>

            {/* Primary Intent & URL Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary Intent */}
              {(!analysisData?.intent && status !== 'completed' && status !== 'failed') ? (
                <PrimaryIntentSkeleton />
              ) : (
                <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className={`${getIntentColor(analysisData?.intent.primary)} p-2 rounded-lg mr-3 text-white`}>
                      {getIntentIcon(analysisData?.intent.primary)}
                    </span>
                    Primary Intent: {analysisData?.intent.primary}
                  </h3>
                  <p className="text-foreground/80 mb-4">{analysisData?.intent.summary}</p>
                  <div className="pt-4 border-t border-foreground/10">
                    <h4 className="font-semibold mb-2 text-foreground/80">Reasoning:</h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">{analysisData?.intent.reasoning}</p>
                  </div>
                </div>
              )}

              {/* URL Score */}
              {(!analysisData?.urlReport && status !== 'completed' && status !== 'failed') ? (
                <URLScoreSkeleton />
              ) : (
                <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Gauge className="text-primary mr-3" size={24} />
                    URL Alignment Score
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="text-4xl font-black mr-4">{analysisData?.urlReport?.score}</div>
                    <div>
                      <div className={`${scoreInfo.bg} text-white px-3 py-1 rounded-full text-sm font-bold mb-1`}>
                        {scoreInfo.desc}
                      </div>
                      <div className="text-foreground/80 text-sm">out of 10</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className={`${scoreInfo.bg} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${(analysisData?.urlReport?.score / 10) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-foreground/80 text-sm">
                    This score represents how well your URL content aligns with the identified search intent.
                  </p>
                </div>
              )}
            </div>

            {/* Intent Breakdown */}
            {(!analysisData?.intent?.intent_breakdown && status !== 'completed' && status !== 'failed') ? (
              <IntentBreakdownSkeleton />
            ) : (
              <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <BarChart2 className="text-primary mr-3" size={24} />
                  Intent Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(analysisData?.intent?.intent_breakdown)?.map(([intent, percentage]) => (
                    <div key={intent} className="text-center">
                      <div className="mb-3">
                        <div className={`${getIntentColor(intent.charAt(0).toUpperCase() + intent.slice(1))} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white`}>
                          {getIntentIcon(intent.charAt(0).toUpperCase() + intent.slice(1))}
                        </div>
                        <h4 className="font-semibold capitalize">{intent}</h4>
                      </div>
                      <div className="text-3xl font-black text-primary mb-2">{percentage}%</div>
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${getIntentColor(intent.charAt(0).toUpperCase() + intent.slice(1)).replace('bg-', 'bg-')} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Needs & Page Classifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Needs */}
              {(!analysisData?.intent?.user_needs && status !== 'completed' && status !== 'failed') ? (
                <UserNeedsSkeleton />
              ) : (
                <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Users className="text-primary mr-3" size={24} />
                    User Needs
                  </h3>
                  <ul className="space-y-3">
                    {analysisData?.intent?.user_needs?.map((need, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-primary mr-3 mt-1 shrink-0" size={16} />
                        <span className="text-foreground/80">{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Page Classifications */}
              {(!analysisData?.pageClassifications && status !== 'completed' && status !== 'failed') ? (
                <PageClassificationsSkeleton />
              ) : (
                <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Globe className="text-primary mr-3" size={24} />
                    Competitor Page Classifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analysisData?.pageClassifications)?.map(([url, classification]) => (
                      <div key={url} className="flex items-center justify-between p-3 rounded-lg border border-foreground/10">
                        <div className="flex-1 min-w-0">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 dark:text-primary dark:hover:text-primary/80 hover:text-blue-300 text-sm truncate flex items-center"
                          >
                            <span className="truncate">{url}</span>
                            <ExternalLink size={12} className="ml-2 shrink-0" />
                          </a>
                        </div>
                        <span className={`${getIntentColor(classification)} text-white dark:text-foreground px-2 py-1 rounded text-xs font-bold ml-3`}>
                          {classification}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {(!analysisData?.urlReport?.suggestions && status !== 'completed' && status !== 'failed') ? (
              <SuggestionsSkeleton />
            ) : (
              <div className="bg-gray-100 dark:bg-black rounded-lg p-6 border border-foreground/10">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Lightbulb className="text-primary mr-3" size={24} />
                  Optimization Suggestions
                </h3>
                <div className="space-y-4">
                  {analysisData?.urlReport?.suggestions?.map((suggestion, index) => (
                    <div key={index} className="flex items-start p-4  rounded-lg border border-foreground/10">
                      <div className="bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-foreground/80 leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                href="/search-intent"
                size="lg"
              // className="bg-primary text-black hover:bg-primary/90 font-bold px-8 py-3"
              >
                <Search className="mr-2" size={20} />
                Analyze Another Keyword
              </Button>
              <Button
                href="/tools"
                size="lg"
                className=" text-black"
                variant="outline"
              // className="border-gray-700 hover:bg-[#2A2A2A] text-white px-8 py-3"
              >
                <ArrowRight className="mr-2" size={20} />
                Explore More Tools
              </Button>
            </div>
          </div>

        </Container>
      </section>






    </div>
  );
}

export default function SearchIntentPage({ blogPosts }) {
  return (
    <Suspense>
      <SearchIntent blogPosts={blogPosts} />
    </Suspense>
  );
}
