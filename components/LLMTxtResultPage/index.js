"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  DownloadCloud,
  Copy,
  FileText,
  FileCode,
  BarChart3,
  TrendingUp,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getPathname } from "@/lib/getpathname";
import CostDisplay from "@/components/CostDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function LLMTxtResult({ blogPosts }) {
  const [url, setUrl] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [viewMode, setViewMode] = useState("markdown");
  const [sendToEmail, setSendToEmail] = useState(false);
  const [cost, setCost] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [contentFormats, setContentFormats] = useState({});
  const { trackAnalysis, currentAnalysis, clearAnalysis } = useFirebase();

  // Helper function to toggle content format for a specific page
  const toggleContentFormat = (pageIndex) => {
    setContentFormats((prev) => ({
      ...prev,
      [pageIndex]: prev[pageIndex] === "txt" ? "markdown" : "txt",
    }));
  };

  // Helper function to get content format for a specific page
  const getContentFormat = (pageIndex) => {
    return contentFormats[pageIndex] || "markdown";
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentAnalysis ? currentAnalysis.status : "initializing"
  );

  // For downloading the analysis report
  const downloadReport = () => {
    const report = generateReport();
    const element = document.createElement("a");
    const file = new Blob([report], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `website-analysis-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateReport = () => {
    if (!analysisData) return "";

    let report = `WEBSITE ANALYSIS REPORT\n`;
    report += `URL: ${analysisData.baseUrl}\n`;
    report += `Analysis Date: ${new Date().toISOString()}\n`;
    report += `Mode: ${analysisData.mode}\n\n`;

    const seoScore = analysisData.seoAnalysis.seoScore;
    report += `SEO SCORE: ${
      typeof seoScore === "string" ? seoScore : seoScore?.toString() || "N/A"
    }\n\n`;

    report += `CONTENT STRUCTURE:\n${analysisData.seoAnalysis.contentStructure}\n\n`;
    report += `KEYWORD DENSITY:\n${analysisData.seoAnalysis.keywordDensity}\n\n`;
    report += `INTERNAL LINKING:\n${analysisData.seoAnalysis.internalLinking}\n\n`;

    report += `CONTENT GAPS:\n`;
    analysisData.contentGaps.forEach((gap, index) => {
      report += `${index + 1}. ${gap}\n`;
    });
    report += `\n`;

    report += `TOPICS:\n`;
    analysisData.topics.forEach((topic, index) => {
      report += `${index + 1}. ${topic}\n`;
    });
    report += `\n`;

    report += `RECOMMENDATIONS:\n`;
    analysisData.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;

    report += `CRAWL SUMMARY:\n`;
    report += `Total Pages: ${analysisData.crawlSummary.totalPages}\n`;
    report += `Total Words: ${analysisData.crawlSummary.totalWords}\n`;
    report += `Average Words Per Page: ${analysisData.crawlSummary.avgWordsPerPage}\n\n`;

    // Add markdown content for each page
    if (analysisData.markdownPages && analysisData.markdownPages.length > 0) {
      report += `MARKDOWN CONTENT:\n`;
      report += `==========================================\n\n`;

      analysisData.markdownPages.forEach((page, index) => {
        report += `PAGE ${index + 1}: ${page.title || `Page ${index + 1}`}\n`;
        report += `URL: ${page.url || "N/A"}\n`;
        report += `Description: ${page.description || "N/A"}\n`;
        report += `Word Count: ${page.wordCount || "N/A"}\n`;
        report += `Timestamp: ${page.timestamp || "N/A"}\n`;
        report += `Keywords: ${page.keywords || "N/A"}\n`;
        report += `------------------------------------------\n\n`;

        if (page.content && typeof page.content === "string") {
          report += `CONTENT:\n${page.content}\n\n`;
        } else {
          report += `CONTENT: No content available\n\n`;
        }

        report += `==========================================\n\n`;
      });
    }

    if (analysisData.processedAt) {
      report += `Processed At: ${new Date(
        analysisData.processedAt
      ).toLocaleString()}\n`;
    }

    if (analysisData.processingTime) {
      report += `Processing Time: ${new Date(
        analysisData.processingTime
      ).toLocaleString()}\n`;
    }

    return report;
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    if (docId) {
      trackAnalysis({
        type: "llmstxt",
        docId: docId,
        collection: "llmstxt",
        meta: {
          url: url,
        },
      });
    }
  }, [docId, router, trackAnalysis, url]);

  useEffect(() => {
    if (currentAnalysis && currentAnalysis.type === "llmstxt") {
      setStatus(currentAnalysis.status);
      setAnalysisData(currentAnalysis.data || null);
      setUrl(currentAnalysis.url || "");
      setUpdatedAt(currentAnalysis.updatedAt || "");
      setSendToEmail(currentAnalysis?.sendToEmail || false);
      setCost(currentAnalysis?.cost || null);
      setCurrentUrl(currentAnalysis?.currentUrl || "");

      if (
        currentAnalysis.status === "completed" ||
        currentAnalysis.status === "failed"
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentAnalysis.error) {
        setError(currentAnalysis.error);
      }
    }
  }, [currentAnalysis]);

  if (!docId) {
    router.push(getPathname("llmstxt"));
  }

  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-foreground/80">{error}</p>
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
        <LoadingScreen
          status={status}
          type="llmstxt"
          docId={docId}
          collection="llmstxt"
          sendToEmail={sendToEmail}
          blogPosts={blogPosts}
          currentUrl={currentUrl}
        />
      </>
    );
  }

  if (!analysisData) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Analysis Data</h1>
            <p className="text-foreground/80">Analysis data not found.</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-[#ffcc0070] dark:from-[#4e503a] dark:to-background py-12 relative overflow-hidden">
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

        <Container className="relative z-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
              Website Analysis Results
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-lg text-foreground/80 mb-2">
                  <span className="font-bold text-primary">URL:</span>{" "}
                  {analysisData.baseUrl}
                </p>
                <p className="text-sm text-foreground/80">
                  <span className="font-bold">Analysis Mode:</span>{" "}
                  {analysisData.mode}
                </p>
                <p className="text-sm text-foreground/80">
                  <span className="font-bold">Pages Analyzed:</span>{" "}
                  {analysisData.crawledPages}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  className="bg-card hover:bg-card/80 text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer border border-foreground/10"
                  onClick={() => copyToClipboard(generateReport())}
                >
                  <Copy size={16} />
                  Copy Report
                </button>
                <button
                  className="bg-primary hover:bg-primary/90 text-black font-bold px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer"
                  onClick={downloadReport}
                >
                  <DownloadCloud size={16} />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {analysisData?.markdownPages &&
                analysisData?.markdownPages?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Markdown Content Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="page0" className="w-full">
                        <TabsList className="w-full md:flex-row flex-col">
                          {analysisData?.markdownPages?.map((page, index) => (
                            <TabsTrigger
                              key={index}
                              value={`page${index}`}
                              className="flex-1 max-md:!w-full"
                            >
                              {page.title && page.title.length > 20
                                ? `${page.title.substring(0, 20)}...`
                                : page.title || `Page ${index + 1}`}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {analysisData?.markdownPages?.map((page, index) => (
                          <TabsContent
                            key={index}
                            value={`page${index}`}
                            className="focus:outline-none"
                          >
                            <div className="relative">
                              {/* Format toggle and action buttons positioned at top */}
                              <div className="absolute top-2 right-2 z-10 flex gap-2">
                                {/* Format Toggle */}
                                <div className="flex bg-background/80 backdrop-blur-sm rounded-md border">
                                  <Button
                                    size="sm"
                                    onClick={() => toggleContentFormat(index)}
                                    className={`h-7 px-3 text-xs rounded-r-none bg-accent backdrop-blur-sm hover:text-black ${
                                      getContentFormat(index) === "markdown"
                                        ? "bg-primary"
                                        : "bg-accent text-foreground"
                                    }`}
                                  >
                                    .md
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => toggleContentFormat(index)}
                                    className={`h-7 px-3 text-xs rounded-l-none bg-accent backdrop-blur-sm hover:text-black ${
                                      getContentFormat(index) === "txt"
                                        ? "bg-primary"
                                        : "bg-accent text-foreground"
                                    }`}
                                  >
                                    .txt
                                  </Button>
                                </div>

                                {/* Copy Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (
                                      page.content &&
                                      typeof page.content === "string"
                                    ) {
                                      const format = getContentFormat(index);
                                      const content =
                                        format === "txt"
                                          ? page.content
                                              .replace(/#{1,6}\s+/g, "")
                                              .replace(/\*\*(.*?)\*\*/g, "$1")
                                              .replace(/\*(.*?)\*/g, "$1")
                                          : page.content;

                                      navigator.clipboard.writeText(content);
                                      toast.success(
                                        `${format.toUpperCase()} content copied to clipboard!`
                                      );
                                    }
                                  }}
                                  className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                                >
                                  <Copy className="h-3 w-3 text-foreground" />
                                </Button>

                                {/* Download Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (
                                      page.content &&
                                      typeof page.content === "string"
                                    ) {
                                      const format = getContentFormat(index);
                                      const content =
                                        format === "txt"
                                          ? page.content
                                              .replace(/#{1,6}\s+/g, "")
                                              .replace(/\*\*(.*?)\*\*/g, "$1")
                                              .replace(/\*(.*?)\*/g, "$1")
                                          : page.content;

                                      const blob = new Blob([content], {
                                        type:
                                          format === "txt"
                                            ? "text/plain"
                                            : "text/markdown",
                                      });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = `${
                                        page.title || `page-${index + 1}`
                                      }.${format}`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                      toast.success(
                                        `${format.toUpperCase()} file downloaded!`
                                      );
                                    }
                                  }}
                                  className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                                >
                                  <DownloadCloud className="h-3 w-3 text-foreground" />
                                </Button>
                              </div>

                              <div className="bg-gray-100 dark:bg-accent dark:text-foreground p-4 rounded-md max-h-96 overflow-auto">
                                <div className="prose prose-sm max-w-none">
                                  {page.content &&
                                  typeof page.content === "string" ? (
                                    getContentFormat(index) === "markdown" ? (
                                      <ReactMarkdown
                                        components={{
                                          h1: ({ node, ...props }) => (
                                            <h1
                                              {...props}
                                              className="text-xl font-bold mb-2"
                                            />
                                          ),
                                          h2: ({ node, ...props }) => (
                                            <h2
                                              {...props}
                                              className="text-lg font-bold mb-2"
                                            />
                                          ),
                                          h3: ({ node, ...props }) => (
                                            <h3
                                              {...props}
                                              className="text-base font-bold mb-1"
                                            />
                                          ),
                                          h4: ({ node, ...props }) => (
                                            <h4
                                              {...props}
                                              className="text-sm font-bold mb-1"
                                            />
                                          ),
                                          p: ({ node, ...props }) => (
                                            <p
                                              {...props}
                                              className="mb-2 text-sm"
                                            />
                                          ),
                                          ul: ({ node, ...props }) => (
                                            <ul
                                              {...props}
                                              className="list-disc pl-4 mb-2 text-sm"
                                            />
                                          ),
                                          li: ({ node, ...props }) => (
                                            <li {...props} className="mb-1" />
                                          ),
                                          a: ({ node, ...props }) => (
                                            <a
                                              {...props}
                                              className="text-blue-600 hover:underline"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            />
                                          ),
                                        }}
                                      >
                                        {page.content}
                                      </ReactMarkdown>
                                    ) : (
                                      <pre className="whitespace-pre-wrap text-sm font-mono">
                                        {page.content
                                          .replace(/#{1,6}\s+/g, "")
                                          .replace(/\*\*(.*?)\*\*/g, "$1")
                                          .replace(/\*(.*?)\*/g, "$1")}
                                      </pre>
                                    )
                                  ) : (
                                    <div className="text-sm text-muted-foreground">
                                      No content available for this page.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                )}

              <Card>
                <CardHeader>
                  <CardTitle>Pages Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData?.crawlSummary?.pages?.map((page, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 border-primary"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-primary">
                            {page.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="border-foreground/80"
                          >
                            {page.wordCount} words
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {page.url}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Analyzed: {new Date(page.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Action Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-[#FFDD00]">
        <Container>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-black mb-6">
              Ready to Improve Your Website?
            </h2>
            <p className="text-lg text-black/80 max-w-3xl mx-auto mb-8">
              Get expert recommendations on how to optimize your content for
              both users and search engines. Our SEO tools help you cut through
              the noise and focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/llms-txt-generator"
                size="lg"
                className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-md transition-all"
              >
                Run Another Analysis
              </Button>
              <Button
                href="/free-tools"
                size="lg"
                className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-md transition-all"
              >
                Browse Our SEO Tools
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <CostDisplay evaluationCost={cost} />
    </main>
  );
}

export default function LLMTxtResultPage({ blogPosts }) {
  return (
    <Suspense>
      <LLMTxtResult blogPosts={blogPosts} />
    </Suspense>
  );
}
