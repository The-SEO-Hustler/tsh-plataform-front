"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { TriangleAlert, LoaderCircle, ArrowLeft } from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreenKeyword from "@/components/LoadingScreenKeyword";
import { Search, Eye, ChevronRight, AlignLeft, BarChart2, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function AdvancedKeywordAnalysis() {
  const [keyword, setKeyword] = useState("");
  const [contentType, setContentType] = useState("blog_post");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");

  const { trackAdvancedKeywordAnalysis, currentAdvancedKeywordAnalysis, removeAdvancedKeywordAnalysis } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentAdvancedKeywordAnalysis ? currentAdvancedKeywordAnalysis.status : "initializing"
  );
  const [selectedSerp, setSelectedSerp] = useState(null);

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
      setKeyword(currentAdvancedKeywordAnalysis.keyword || "");
      setContentType(currentAdvancedKeywordAnalysis.contentType || "blog_post");
      setUpdatedAt(currentAdvancedKeywordAnalysis.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (
        currentAdvancedKeywordAnalysis.status === "completed" ||
        currentAdvancedKeywordAnalysis.status === "failed"
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentAdvancedKeywordAnalysis && (currentAdvancedKeywordAnalysis?.status !== "completed" && currentAdvancedKeywordAnalysis?.status !== "failed")) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    if (!keyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    if (
      currentAdvancedKeywordAnalysis &&
      currentAdvancedKeywordAnalysis?.status !== "completed" &&
      currentAdvancedKeywordAnalysis?.status !== "failed"
    ) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const formData = new FormData();
      formData.append("keyword", keyword);

      const response = await fetch("/api/advanced-keyword-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content analysis");
      }

      const data = await response.json();
      if (data.success) {
        removeAdvancedKeywordAnalysis();
        trackAdvancedKeywordAnalysis(data.docId, keyword);
        router.push(`/advanced-keyword-analysis?id=${data.docId}`);
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching content analysis"
      );
      setLoading(false);
    }
    setLoading(false);
  };

  // Function to get color based on intent type
  const getIntentColor = (intent) => {
    switch (intent) {
      case 'Commercial Investigation':
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

  // Function to render difficulty badge
  const getDifficultyBadge = (difficulty) => {
    if (difficulty <= 30) return <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold">Easy</span>;
    if (difficulty <= 60) return <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">Medium</span>;
    return <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">Hard</span>;
  };
  const renderIntentBar = (intentBreakdown) => {
    return (
      <div className="flex h-2 w-full overflow-hidden rounded-full mt-2">
        <div className="bg-green-600" style={{ width: `${intentBreakdown.informational}%` }}></div>
        <div className="bg-purple-600" style={{ width: `${intentBreakdown.navigational}%` }}></div>
        <div className="bg-blue-600" style={{ width: `${intentBreakdown.commercial}%` }}></div>
        <div className="bg-orange-600" style={{ width: `${intentBreakdown.transactional}%` }}></div>
      </div>
    );
  };

  // Function to render heading structure in dialog
  const renderHeadings = (headings) => {
    if (!headings || headings.length === 0) {
      return <p className="text-gray-500">No headings available for this URL.</p>;
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
    return (
      <Container className="!py-16">
        <h1 className="text-3xl font-bold mb-6">Advanced Keyword Analysis</h1>

        <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="keyword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Target Keyword
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                id="keyword"
                placeholder="Enter a keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={loading}
              />
            </div>



            <button
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Analyze Keyword
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center">
              <TriangleAlert className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </Container>
    );
  }
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
  if (loadingPage) {
    return (
      <>
        <LoadingScreenKeyword status={status} docId={docId} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Hero Header with Keyword Info */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#4e503a] to-black relative overflow-hidden">
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
          <div className="flex items-center gap-3 text-gray-300 text-sm mb-4">
            <span><Link href="/content-planning" className="hover:text-primary transition-colors"> Content Planning</Link></span>
            <ChevronRight size={16} />
            <span className="text-primary font-semibold">{analysisData.keyword || 'New Content'}</span>
          </div>


          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center">
                <Search className="text-primary h-10 w-10 mr-3" />
                {analysisData.keyword}
              </h1>
              <div className="flex items-center gap-3">
                <div className={`${getIntentColor(analysisData.search_intent.primary)} px-4 py-1 rounded-full text-white font-bold`}>
                  {analysisData.search_intent.primary}
                </div>
                <span className="text-gray-300">
                  {analysisData.search_intent.confidence}% Confidence
                </span>
              </div>
            </div>


          </div>
        </Container>
      </section>

      {/* Overview Metrics */}
      <section className="py-10 bg-black border-b border-gray-800">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Volume */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-4 border-primary hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 text-sm uppercase mb-2 font-semibold">Search Volume</h3>
              <div className="text-3xl font-black">
                {analysisData.search_volume > 0 ? analysisData.search_volume.toLocaleString() : 'N/A'}
              </div>
              <p className="text-gray-400 text-sm mt-2">Monthly searches</p>
            </div>

            {/* CPC */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-4 border-blue-500 hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 text-sm uppercase mb-2 font-semibold">CPC</h3>
              <div className="text-3xl font-black">
                {analysisData.cpc > 0 ? `$${analysisData.cpc.toFixed(2)}` : 'N/A'}
              </div>
              <p className="text-gray-400 text-sm mt-2">Cost per click</p>
            </div>

            {/* Competition */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-4 border-green-500 hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 text-sm uppercase mb-2 font-semibold">Competition</h3>
              <div className="text-3xl font-black">
                {analysisData.competition > 0 ? `${(analysisData.competition * 100).toFixed(0)}%` : 'N/A'}
              </div>
              <p className="text-gray-400 text-sm mt-2">Competitive density</p>
            </div>

            {/* Difficulty */}
            <div className="bg-[#1A1A1A] rounded-lg p-6 border-l-4 border-red-500 hover:translate-y-[-5px] transition-all">
              <h3 className="text-gray-400 text-sm uppercase mb-2 font-semibold">Difficulty</h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black">
                  {analysisData.difficulty > 0 ? analysisData.difficulty : 'N/A'}
                </span>
                {analysisData.difficulty > 0 && getDifficultyBadge(analysisData.difficulty)}
              </div>
              <p className="text-gray-400 text-sm mt-2">Ranking difficulty score</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Search Intent Section */}
      <section className="py-10 bg-[#121212]">
        <Container>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-primary text-black h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
              <Search size={16} />
            </span>
            Search Intent Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Intent */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Primary Intent</h3>
              <div className={`${getIntentColor(analysisData.search_intent.primary)} px-4 py-2 rounded-md text-white font-bold inline-block mb-4`}>
                {analysisData.search_intent.primary}
              </div>
              <p className="text-gray-300">
                {analysisData.search_intent.reasoning}
              </p>
            </div>

            {/* Intent Breakdown */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Intent Breakdown</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">Informational</span>
                    <span className="text-sm font-medium text-primary">{analysisData.search_intent.intent_breakdown.informational}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analysisData.search_intent.intent_breakdown.informational}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">Navigational</span>
                    <span className="text-sm font-medium text-primary">{analysisData.search_intent.intent_breakdown.navigational}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${analysisData.search_intent.intent_breakdown.navigational}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">Commercial</span>
                    <span className="text-sm font-medium text-primary">{analysisData.search_intent.intent_breakdown.commercial}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analysisData.search_intent.intent_breakdown.commercial}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">Transactional</span>
                    <span className="text-sm font-medium text-primary">{analysisData.search_intent.intent_breakdown.transactional}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${analysisData.search_intent.intent_breakdown.transactional}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAA Questions */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">People Also Ask</h3>

              {analysisData.paa_questions && analysisData.paa_questions.length > 0 ? (
                <ul className="space-y-3">
                  {analysisData.paa_questions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight size={18} className="text-primary mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{question}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No "People Also Ask" questions available for this keyword.</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* SERP Analysis */}
      <section className="py-10 bg-[#0A0A0A]">
        <Container>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-primary text-black h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
              <BarChart2 size={16} />
            </span>
            SERP Analysis
          </h2>

          {analysisData.serp_data && analysisData.serp_data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A1A1A] border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Title & URL</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Domain</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {analysisData.serp_data.map((result, index) => (
                    <tr key={index} className="hover:bg-[#1E1E1E] transition-colors">
                      <td className="py-4 px-4 font-mono text-lg font-bold text-primary">
                        #{result.rank}
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-xl">
                          <div className="font-bold text-white mb-1 line-clamp-1">{result.title}</div>
                          <div className="text-sm text-gray-400 line-clamp-2">{result.description}</div>
                          <div className="text-xs text-green-500 mt-1">{result.url}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {result.domain}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                className="bg-[#2A2A2A] hover:bg-primary hover:text-black text-white p-2 rounded-md transition-colors cursor-pointer"
                                title="View Headings"
                              >
                                <AlignLeft size={16} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1A1A1A] text-white border-gray-700 ">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                  <AlignLeft className="text-primary" size={20} />
                                  Headings Structure
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-2 max-h-[500px] overflow-y-auto">
                                <div className="text-sm text-gray-400 mb-4">{result.url}</div>
                                {renderHeadings(analysisData.headings_by_url[result.url])}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2A2A2A] hover:bg-primary hover:text-black text-white p-2 rounded-md transition-colors cursor-pointer"
                            title="Visit Page"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
              <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No SERP Data Available</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn't find any search engine results for this keyword. This might be due to very low search volume or a highly specific query.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Action Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-[#FFAA00]">
        <Container>
          <h2 className="text-3xl font-black text-black mb-6">Ready to Dominate Search Results?</h2>
          <p className="text-lg text-black/80 max-w-3xl mx-auto mb-8">
            Use this keyword analysis to create content that ranks. Our SEO tools help you cut through the noise and focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-md transition-all">
              Explore More Keywords
            </button>
            <button className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-md transition-all">
              Get the Full Report
            </button>
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
