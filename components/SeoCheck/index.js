"use client";

import React, { useState, useEffect, Suspense } from "react";
import Container from "@/components/container";
import s from "./styles.module.css";
import Sidebar from "@/components/sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { cardComponents } from "@/lib/config";
import { Download, Eye, EyeOff, LayoutGrid, Rows2, Search, FileJson, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "@/components/PDFReport";
import { Input } from "@/components/ui/input";
import { useFirebase } from "@/lib/firebase-context";
import { getScoreAppearance } from "@/lib/getScoreAppearance";
import { getPathname } from "@/lib/getpathname";

function SEOAudit() {
  const [focusedCardId, setFocusedCardId] = useState(null);
  const [analysisData, setAnalysisData] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [updatedAt, setUpdatedAt] = useState("");
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
  const [searchQuery, setSearchQuery] = useState("");
  const { trackAnalysis, currentAnalysis } = useFirebase();
  const [status, setStatus] = useState(
    currentAnalysis ? currentAnalysis.status : "initializing"
  );
  const [sendToEmail, setSendToEmail] = useState(false);


  useEffect(() => {
    // Start tracking this analysis in the global context.
    // You can pass an initial URL if needed.
    if (docId) {
      trackAnalysis({
        type: "seo-check",
        docId: docId,
        collection: "seoAnalyses",
        meta: {
          url: url,
        },
      });
    }
  }, [docId, router, trackAnalysis, url]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    console.log("currentAnalysis: ", currentAnalysis);
    if (currentAnalysis && currentAnalysis.type === "seo-check") {
      setStatus(currentAnalysis.status);
      setAnalysisData(currentAnalysis.data || []);
      setUrl(currentAnalysis.url || "");
      setScore(currentAnalysis?.score?.score || 0);
      setUpdatedAt(currentAnalysis.updatedAt || "");
      setSendToEmail(currentAnalysis.sendToEmail || false);
      // Stop loading when analysis is completed or failed.
      if (
        currentAnalysis.status === "completed" ||
        currentAnalysis.status === "failed"
      ) {
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
      score: score,
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
    return data.filter((item) => {
      // Check if the type contains the query
      if (item.type.toLowerCase().includes(query)) return true;

      // Check if the analysis contains the query
      // if (item.analysis && item.analysis.toLowerCase().includes(query)) return true;

      // Check if any data properties contain the query
      if (item.data) {
        // For objects, check if any string values contain the query
        if (typeof item.data === "object") {
          return Object.values(item.data).some(
            (value) =>
              typeof value === "string" && value.toLowerCase().includes(query)
          );
        }
      }

      return false;
    });
  };

  const filteredData = filterDataBySearch(
    analysisData.filter((card) => statusFilters[card.status || "normal"])
  );

  const scoreAppearance = getScoreAppearance(score);
  const ScoreIcon = scoreAppearance.icon;

  if (!docId) {
    router.push(getPathname("seo-check"));
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

  if (loading) {
    return <LoadingScreen status={status} type="seo-check" docId={docId} collection="seoAnalyses" sendToEmail={sendToEmail} />;
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
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${scoreAppearance.gradient} flex items-center justify-center shadow-lg`}
                >
                  <ScoreIcon className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`absolute -bottom-3 ${scoreAppearance.bgColor} rounded-full px-3 py-1 text-sm font-bold border ${scoreAppearance.borderColor} shadow-sm ${scoreAppearance.textColor}`}
                >
                  {score ? score : "N/A"}/100
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{url}</h1>
                <p className="text-muted-foreground text-sm">
                  Last updated:{" "}
                  {updatedAt
                    ? new Date(updatedAt.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-primary text-primary-foreground  rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer !no-underline"
              >
                <FileJson className="w-4 h-4" />
                <span className="hidden md:inline">Export JSON</span>
              </button>
              <PDFDownloadLink
                document={<PDFReport data={analysisData} score={75} />}
                fileName={`seo-report-${new Date().toLocaleDateString()}.pdf`}
                className="px-4 py-2 bg-primary text-primary-foreground  rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors cursor-pointer !no-underline"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden md:inline ">Export PDF</span>
              </PDFDownloadLink>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6 bg-card p-4 rounded-lg sticky top-1 border border-foreground/10 shadow-sm z-[10]">
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
                      className={`${layout === "grid" ? "text-foreground" : "text-foreground/30"}`}
                    />
                  </button>
                  <button
                    className="cursor-pointer"
                    aria-label="row layout"
                    onClick={() => setLayout("row")}
                  >
                    <Rows2
                      size={22}
                      className={`${layout === "row" ? "text-foreground" : "text-foreground/30"}`}
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
                  <button
                    className="flex items-center justify-start !pl-0 gap-2 h-auto p-0 hover:bg-transparent bg-card text-foreground"
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
                  </button>
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
          <div className="mt-12">
            <section className=" py-16 relative overflow-hidden">


              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
                    Your SEO Check Results: The Real Deal
                  </h1>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <section className="py-16">

              <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-3xl font-bold mb-6 text-primary">Understanding Your SEO Score</h2>

                <p className="text-lg text-foreground mb-4">
                  Your overall SEO score isn't just a vanity metric — it's a business health indicator. Every point below 100 represents potential traffic, leads, and revenue you're leaving on the table.
                </p>
                <p className="text-lg text-foreground mb-4">
                  Think of it like a credit score for your website's visibility. The higher the score, the more Google trusts and rewards your site.
                </p>
              </div>

              <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-3xl font-bold mb-6 text-primary">Issue Priority Levels Explained</h2>

                <p className="text-lg text-foreground mb-6">
                  We categorize issues into three levels based on their impact on your rankings and business results:
                </p>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-red-500">Critical Issues (Red)</h3>

                  <p className="text-lg text-foreground mb-3">
                    <span className="font-bold">What they are:</span> These are the SEO equivalent of a five-alarm fire. They actively damage your rankings, visibility, and user experience.
                  </p>

                  <p className="text-lg text-foreground mb-3">
                    <span className="font-bold">Business impact:</span> Critical issues can tank your rankings overnight or prevent your site from ranking well regardless of other efforts.
                  </p>

                  <p className="text-lg text-foreground">
                    <span className="font-bold">Timeline to fix:</span> ASAP — ideally within 7 days. Every day these issues persist, you're hemorrhaging potential traffic.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-yellow-500">Warning Issues (Yellow)</h3>

                  <p className="text-lg text-foreground mb-3">
                    <span className="font-bold">What they are:</span> These won't immediately tank your site, but they're putting a ceiling on how well you can rank.
                  </p>

                  <p className="text-lg text-foreground mb-3">
                    <span className="font-bold">Business impact:</span> Warning issues limit your growth and make your SEO efforts less efficient — like driving with the parking brake on.
                  </p>

                  <p className="text-lg text-foreground">
                    <span className="font-bold">Timeline to fix:</span> Within 30 days. Not emergencies, but addressing them will unlock significant ranking potential.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-500">Improvement Opportunities (Blue)</h3>

                  <p className="text-lg text-foreground mb-3">
                    <span className="font-bold">What they are:</span> These are optimization opportunities that can give you an edge over similarly-ranked competitors.
                  </p>

                  <p className="text-lg text-foreground mb-3">
                    <span className="font-bold">Business impact:</span> The difference between ranking #5 and #1 often comes down to who's addressed these optimizations.
                  </p>

                  <p className="text-lg text-foreground">
                    <span className="font-bold">Timeline to fix:</span> Within 90 days as part of your ongoing SEO strategy.
                  </p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Understanding Each SEO Check</h2>

                {/* Title Tag */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Title Tag</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Length, keyword usage, uniqueness, and formatting of your page's title tag.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Your title tag is the #1 on-page ranking factor and what users see in search results. A weak title means weak rankings and poor click-through rates.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Too long (over 60 characters) — Google will truncate it</li>
                      <li>Too short (under 30 characters) — Wasted opportunity</li>
                      <li>Missing keywords — Google doesn't know what your page is about</li>
                      <li>Duplicate across multiple pages — Confuses search engines</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Keep titles between 50-60 characters</li>
                      <li>Include your primary keyword near the beginning</li>
                      <li>Add your brand name at the end</li>
                      <li>Make it compelling enough that someone would click it</li>
                    </ul>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Meta Description</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence, length, keyword usage, and compelling nature of your description.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> While not a direct ranking factor, your meta description is your free ad in search results. A weak description kills click-through rates, which indirectly hurts rankings.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing entirely — Google will pull random text from your page</li>
                      <li>Too long (over 160 characters) — Gets cut off in results</li>
                      <li>Too short (under 70 characters) — Missed opportunity</li>
                      <li>Generic or vague — Fails to drive clicks</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Write 120-160 character descriptions that sell the page</li>
                      <li>Include your primary keyword naturally</li>
                      <li>Add a clear call-to-action</li>
                      <li>Highlight unique benefits or features</li>
                    </ul>
                  </div>
                </div>

                {/* Heading Tags */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Heading Tags (H1, H2, H3)</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence, hierarchy, keyword usage, and formatting of heading tags.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Heading tags create a content hierarchy that helps Google understand your page's structure and main topics.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing H1 — Like a book without a title</li>
                      <li>Multiple H1s — Confuses search engines about your main topic</li>
                      <li>Improper hierarchy (skipping from H1 to H3) — Breaks content structure</li>
                      <li>No keywords in headings — Missed ranking opportunity</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Use exactly ONE H1 tag containing your primary keyword</li>
                      <li>Use multiple H2s for main sections, including secondary keywords</li>
                      <li>Use H3s for subsections</li>
                      <li>Ensure logical hierarchy (H1 → H2 → H3)</li>
                    </ul>
                  </div>
                </div>

                {/* Image Optimization */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Image Optimization</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Alt text, file size, format, dimensions, and filenames of images.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Unoptimized images hurt page speed (a ranking factor) and miss opportunities to rank in image search.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing alt text — Google can't "see" what the image is about</li>
                      <li>Oversized images — Slow down page load</li>
                      <li>Non-descriptive filenames — Missed SEO opportunity</li>
                      <li>Wrong dimensions — Causes layout shifts (bad for user experience)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Add descriptive alt text to every image</li>
                      <li>Compress images before uploading</li>
                      <li>Use modern formats like WebP</li>
                      <li>Name files descriptively (mountain-bike-trails.webp vs. IMG_12345.jpg)</li>
                    </ul>
                  </div>
                </div>

                {/* Mobile Responsiveness */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Mobile Responsiveness</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> How well your site renders and functions on mobile devices.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Google now uses mobile-first indexing, meaning it primarily uses the mobile version of your site for ranking. Poor mobile experience = poor rankings.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Non-responsive design — Site doesn't adapt to screen size</li>
                      <li>Tiny tap targets — Links/buttons too small for fingers</li>
                      <li>Horizontal scrolling required — Poor user experience</li>
                      <li>Text too small to read — Frustrates users</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Implement fully responsive design</li>
                      <li>Ensure tap targets are at least 44x44 pixels</li>
                      <li>Make text readable without zooming (16px minimum)</li>
                      <li>Test on multiple devices and fix any rendering issues</li>
                    </ul>
                  </div>
                </div>

                {/* Page Speed */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Page Speed</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Load time, Core Web Vitals, render-blocking resources, and overall performance.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Page speed is a direct ranking factor. Each second of load time reduces conversions by ~7% and increases bounce rates.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Slow Largest Contentful Paint (LCP) — Main content takes too long to load</li>
                      <li>Poor Cumulative Layout Shift (CLS) — Page elements move around as page loads</li>
                      <li>High Total Blocking Time (TBT) — Page appears loaded but isn't interactive</li>
                      <li>Unoptimized images and scripts — Unnecessary weight slowing everything down</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Optimize Core Web Vitals (LCP, CLS, TBT)</li>
                      <li>Minimize and defer JavaScript</li>
                      <li>Optimize and lazy-load images</li>
                      <li>Use browser caching and a CDN</li>
                    </ul>
                  </div>
                </div>

                {/* Content Quality */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Content Quality</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Length, readability, keyword usage, formatting, and originality of your content.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Content is the foundation of SEO. Thin or low-quality content rarely ranks well, especially after Google's helpful content updates.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Thin content (under 300 words) — Doesn't demonstrate expertise</li>
                      <li>Keyword stuffing — Looks spammy to Google</li>
                      <li>Poor readability — High bounce rates hurt rankings</li>
                      <li>Duplicate content — Confuses Google about which version to rank</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Create comprehensive content (aim for 1000+ words for important pages)</li>
                      <li>Use keywords naturally throughout</li>
                      <li>Improve readability with short paragraphs, subheadings, and bullet points</li>
                      <li>Ensure content is original and valuable to users</li>
                    </ul>
                  </div>
                </div>

                {/* Broken Links */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Broken Links</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Internal and external links that lead to 404 errors or other non-working pages.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Broken links waste crawl budget, create poor user experiences, and leak link equity.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Internal links to deleted pages — Wastes link equity</li>
                      <li>External links to dead sites — Poor user experience</li>
                      <li>Broken image links — Creates unprofessional appearance</li>
                      <li>Links to redirected pages — Slows down user experience</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Fix or remove broken internal links</li>
                      <li>Update or remove broken external links</li>
                      <li>Set up 301 redirects for changed URLs</li>
                      <li>Implement a custom 404 page that guides users back to working content</li>
                    </ul>
                  </div>
                </div>

                {/* URL Structure */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">URL Structure</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Length, readability, keyword usage, and technical formatting of your URLs.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Clean, descriptive URLs help both users and search engines understand what a page is about before they even visit it.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Dynamic parameters (example.com/?p=123) — Hard for humans to understand</li>
                      <li>Excessive length — Gets truncated in search results</li>
                      <li>Missing keywords — Missed opportunity for relevance</li>
                      <li>Uppercase letters, special characters — Can cause technical issues</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Use descriptive, keyword-rich URLs</li>
                      <li>Keep URLs short and simple</li>
                      <li>Use hyphens to separate words</li>
                      <li>Use lowercase letters only</li>
                    </ul>
                  </div>
                </div>

                {/* Schema Markup */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Schema Markup</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence and implementation of structured data.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Schema markup helps Google understand your content better and can earn rich snippets in search results (stars, prices, FAQs, etc.).
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing schema entirely — No chance for rich snippets</li>
                      <li>Incorrect implementation — Won't be recognized by Google</li>
                      <li>Wrong schema type — Mismatched with content purpose</li>
                      <li>Incomplete properties — Missing required fields</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Implement appropriate schema for your content type</li>
                      <li>Use Google's Structured Data Testing Tool to validate</li>
                      <li>Include all required properties</li>
                      <li>Match schema type to your content purpose</li>
                    </ul>
                  </div>
                </div>

                {/* Social Media Tags */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Social Media Tags</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Open Graph and Twitter Card implementation.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> These tags control how your content appears when shared on social platforms, affecting click-through rates from social media.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing tags — Social platforms guessing what to display</li>
                      <li>Missing images — Plain text previews get fewer clicks</li>
                      <li>Incorrect dimensions — Images get cropped poorly</li>
                      <li>Duplicate title/description with meta tags — Missed opportunity for customization</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Add Open Graph tags for Facebook, LinkedIn, etc.</li>
                      <li>Add Twitter Card markup</li>
                      <li>Use properly sized images (1200x630px for OG, 1200x675px for Twitter)</li>
                      <li>Write compelling titles and descriptions specifically for social sharing</li>
                    </ul>
                  </div>
                </div>

                {/* SSL Certificate */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">SSL Certificate</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence, validity, and implementation of HTTPS.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> HTTPS is a confirmed Google ranking factor and builds user trust. Sites without SSL certificates appear as "Not Secure" in browsers.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing SSL entirely — Rankings penalty and security warning</li>
                      <li>Mixed content — Secure and insecure elements on same page</li>
                      <li>Expired certificate — Creates security warnings</li>
                      <li>Wrong domain on certificate — Creates security warnings</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Install an SSL certificate (many hosts offer free certificates)</li>
                      <li>Force HTTPS with proper redirects</li>
                      <li>Fix mixed content warnings</li>
                      <li>Set up auto-renewal for your certificate</li>
                    </ul>
                  </div>
                </div>

                {/* Robots.txt */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Robots.txt</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence, formatting, and directives in your robots.txt file.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Controls which parts of your site search engines can access. Incorrect configuration can accidentally block important content.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Blocking important content — Prevents indexing</li>
                      <li>Too permissive — Allows indexing of low-value pages</li>
                      <li>Syntax errors — Can cause unpredictable crawling</li>
                      <li>Missing entirely — No crawler control</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Create a proper robots.txt file if missing</li>
                      <li>Use proper syntax for directives</li>
                      <li>Don't block CSS and JavaScript files</li>
                      <li>Only block content that shouldn't be indexed</li>
                    </ul>
                  </div>
                </div>

                {/* Sitemap */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Sitemap</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence, format, and content of your XML sitemap.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Helps search engines discover and understand all the pages on your site, especially for larger sites.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing entirely — Makes it harder for Google to find all pages</li>
                      <li>Including non-canonical URLs — Confuses search engines</li>
                      <li>Including noindexed pages — Wastes crawl budget</li>
                      <li>Not submitted to Google Search Console — Missed opportunity</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Create an XML sitemap if missing</li>
                      <li>Include only indexable, canonical URLs</li>
                      <li>Keep under 50,000 URLs per sitemap file</li>
                      <li>Submit to Google Search Console</li>
                    </ul>
                  </div>
                </div>

                {/* Canonical Tags */}
                <div className="bg-card p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Canonical Tags</h3>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">What we check:</span> Presence and implementation of canonical tags.
                  </p>

                  <p className="text-lg text-foreground mb-4">
                    <span className="font-bold">Why it matters:</span> Tells search engines which version of similar pages should be considered the "master" to prevent duplicate content issues.
                  </p>

                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">Common issues:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Missing on duplicate/similar content — Can cause ranking dilution</li>
                      <li>Self-referencing canonicals missing — Best practice not followed</li>
                      <li>Incorrect implementation — Points to wrong URL</li>
                      <li>Conflicting signals — Canonical tag contradicts other directives</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-lg font-bold mb-2">How to fix it:</p>
                    <ul className="list-disc pl-8 text-foreground space-y-1">
                      <li>Add canonical tags to all pages with similar/duplicate content</li>
                      <li>Add self-referencing canonicals to all other pages</li>
                      <li>Ensure the URL in the canonical tag is correct</li>
                      <li>Make sure other directives don't contradict your canonical tags</li>
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center mt-12">
                  <Link href="/seo-check" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-all mx-auto max-w-max">
                    Run Another SEO Check
                  </Link>
                </div>
              </div>
            </section>
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
