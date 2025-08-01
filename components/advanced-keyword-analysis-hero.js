"use client";
import React from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useFirebase } from "@/lib/firebase-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Target,
  TrendingUp,
  BarChart2,
  Eye,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Info,
  Lightbulb,
  Zap,
  Filter,
  Gauge,
  Calendar,
  ArrowRight,
  Play,
  RotateCcw,
  Download,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUsage } from "@/lib/usage-context";
import { getPathname } from "@/lib/getpathname";
import HeroTemplate from "./HeroTemplate";
function AdvancedKeywordAnalysisHero() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {
    currentAnalysis,
    trackAnalysis,
    clearAnalysis,
  } = useFirebase();
  const { usage, setUsage } = useUsage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const specialCharPattern = /[^a-zA-Z0-9 ]/;
    if (specialCharPattern.test(keyword)) {
      setError("Keyword should not contain special characters.");
      return;
    }
    if (keyword.trim().length < 2) {
      setError("Keyword must be at least two characters long.");
      return;
    }
    if (usage?.remaining <= 0) {
      toast.error(
        "You have reached your daily limit. Please try again tomorrow."
      );
      return;
    }
    if (usage.status === "error" || !usage) {
      toast.error("Please try again later, our team is working on it.");
      fetch("/api/notifySlack", {
        method: "POST",
        body: JSON.stringify({
          status: "info",
          docId: "No response from server",
          route: "advanced-keyword-analysis",
        }),
      });

      return;
    }

    if (
      currentAnalysis &&
      currentAnalysis?.status !== "completed" &&
      currentAnalysis?.status !== "failed"
    ) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }



    setLoading(true);
    setError(null);

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
        trackAnalysis({
          type: "advanced-keyword-analysis",
          docId: data.docId,
          collection: "keywordAnalysis",
          meta: {
            keyword: keyword,
          },
        });
        router.push(`${getPathname("advanced-keyword-analysis")}/result?id=${data.docId}`);
        setUsage((prevUsage) => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1,
        }));
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching content analysis"
      );
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <main className="min-h-screen relative py-6 md:py-0 bg-background">
      {/* Hero Section*/}
      <HeroTemplate noBg className="!md:pt-0 !pb-0 !md:pb-0 !mt-0 !pt-0 ">
        <Container>
          <section className="min-h-screen  flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Keyword Input */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Advanced <span className="text-primary">Keyword Analysis</span>
                </h1>
                <p className="text-xl ">
                  Get detailed insights and recommendations to optimize your
                  keyword strategy.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. Best Keto Diet Plan"
                      className="w-full px-4 sm:px-6 sm:pr-[240px] pr-[60px] py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 ${loading ? "animate-pulse" : ""
                        } disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-foreground/80`}
                      disabled={
                        loading || usage?.remaining <= 0 || usage === null
                      }
                    >
                      <span className="sm:block hidden">
                        {loading ? "Analyzing..." : "Analyze Keyword"}
                      </span>
                      <ArrowRight className="sm:ml-2 sm:h-4 sm:w-4" />
                    </Button>
                    <label htmlFor="keyword" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Keyword</label>
                  </div>
                </form>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Feature Preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl -z-10" />
                <div className="bg-card p-8 rounded-2xl shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Search className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Keyword Insights</h3>
                        <p className="text-sm  text-foreground/80">
                          Detailed analysis of keyword performance
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Search Volume</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                          High
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Competition</span>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                          Moderate
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Relevance</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                          Excellent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </HeroTemplate>
      {/* How It Works Section */}
      <section className="py-16  dark:bg-black bg-card border-t border-foreground/10 z-10 relative">
        <Container>
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">
            How It Works:{" "}
            <span className="text-primary">Quick Start Guide</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Step 1 */}
            <div className="dark:bg-card bg-background rounded-xl p-4 md:p-8 border-l-4 border-primary">
              <div className="flex items-center mb-4">
                <span className="bg-primary text-black min-w-8 min-h-8 rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </span>
                <h3 className="text-xl font-bold">Enter Your Seed Keyword</h3>
              </div>
              <p className=" leading-relaxed">
                Type in any keyword or phrase you want to explore (for example,
                &quot;keto diet&quot;) and hit{" "}
                <span className="text-primary font-semibold">
                  Analyze Keyword
                </span>
                .
              </p>
            </div>

            {/* Step 2 */}
            <div className="dark:bg-card bg-background rounded-xl p-4 md:p-8 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <span className="bg-blue-500 text-white min-w-8 min-h-8 rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </span>
                <h3 className="text-xl font-bold">
                  Data Aggregation Behind the Scenes
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start flex-col md:flex-row">
                  <Gauge
                    className="text-primary mr-3 mt-1 shrink-0 min-h-8 min-w-8"
                    size={32}
                  />
                  <div>
                    <span className="font-semibold">Volume & Difficulty:</span>{" "}
                    We pull monthly search volume, estimated CPC, competitive
                    density, and a ranking-difficulty score.
                  </div>
                </div>
                <div className="flex items-start flex-col md:flex-row">
                  <Eye
                    className="text-primary mr-3 mt-1 shrink-0 min-h-8 min-w-8"
                    size={32}
                  />
                  <div>
                    <span className="font-semibold">SERP Scrape:</span> We scan
                    the top 10–20 results to extract heading structure (H1–H3),
                    meta titles/descriptions, and URL slugs.
                  </div>
                </div>
                <div className="flex items-start flex-col md:flex-row">
                  <Target
                    className="text-primary mr-3 mt-1 shrink-0 min-h-8 min-w-8"
                    size={32}
                  />
                  <div>
                    <span className="font-semibold">Intent & PAA:</span> We
                    classify overall search intent and collect &quot;People Also Ask&quot;
                    questions.
                  </div>
                </div>
                <div className="flex items-start flex-col md:flex-row">
                  <TrendingUp
                    className="text-primary mr-3 mt-1 shrink-0 min-h-8 min-w-8"
                    size={32}
                  />
                  <div>
                    <span className="font-semibold">Related Insights:</span> We
                    merge in &quot;People Also Search For,&quot; related keywords, and
                    Google Trends data.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Interpretation */}
          <div className="dark:bg-card bg-background rounded-2xl p-4 md:p-8 border border-border">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 flex-col md:flex-row">
              <Lightbulb className="text-primary  min-h-6 min-w-6" size={24} />
              Step-by-Step: Interpreting Your Results
            </h3>

            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="mb-8 grid grid-cols-1 !h-auto md:grid-cols-4 w-full">
                <TabsTrigger
                  value="metrics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black justify-start md:justify-center"
                >
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Core Metrics
                </TabsTrigger>
                <TabsTrigger
                  value="intent"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black justify-start md:justify-center"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Search Intent
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black justify-start md:justify-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Questions & Related
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black justify-start md:justify-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Advanced Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-primary">
                      Core Metrics Panel
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-primary text-black p-2 rounded-lg mr-3">
                          <Eye size={16} />
                        </div>
                        <div>
                          <h5 className="font-semibold">Search Volume</h5>
                          <p className="text-foreground/80 text-sm">
                            Monthly average searches. High volume ≠ easy
                            ranking.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                          <DollarSign size={16} />
                        </div>
                        <div>
                          <h5 className="font-semibold">
                            CPC (Cost-Per-Click)
                          </h5>
                          <p className="text-foreground/80 text-sm">
                            Great proxy for commercial intent—higher CPC often
                            signals buyer interest.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                          <Users size={16} />
                        </div>
                        <div>
                          <h5 className="font-semibold">Competition Density</h5>
                          <p className="text-foreground/80 text-sm">
                            Ratio of advertisers bidding on this term.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-red-500 text-white p-2 rounded-lg mr-3">
                          <Gauge size={16} />
                        </div>
                        <div>
                          <h5 className="font-semibold">Difficulty Score</h5>
                          <p className="text-foreground/80 text-sm">
                            Our proprietary aggregate indicating how hard it is
                            to rank organically (0–100 scale).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card dark:bg-background rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb
                        className="text-primary mr-2 min-h-5 min-w-5"
                        size={20}
                      />
                      <h5 className="font-bold">Pro Tip</h5>
                    </div>
                    <p className=" leading-relaxed">
                      Balance volume + difficulty. A mid-volume (10K–30K)
                      keyword with moderate difficulty (30–50) often yields the{" "}
                      <span className="text-primary font-semibold">
                        best ROI
                      </span>{" "}
                      for mid-size sites.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="intent" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-primary">
                      Search Intent Breakdown
                    </h4>
                    <p className=" mb-6">
                      Visualize what users are actually trying to accomplish:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-card dark:bg-background rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="font-medium">Informational</span>
                        </div>
                        <span className="text-foreground/80 text-sm text-right">
                          tutorials, guides
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card dark:bg-background rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                          <span className="font-medium">Navigational</span>
                        </div>
                        <span className="text-foreground/80 text-sm text-right">
                          a specific website
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card dark:bg-background rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="font-medium">Commercial</span>
                        </div>
                        <span className="text-foreground/80 text-sm text-right">
                          product comparisons, reviews
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card dark:bg-background rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                          <span className="font-medium">Transactional</span>
                        </div>
                        <span className="text-foreground/80 text-sm text-right">
                          ready-to-buy queries
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card dark:bg-background rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Play
                        className="text-primary mr-2 min-h-5 min-w-5"
                        size={20}
                      />
                      <h5 className="font-bold">Action Items</h5>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      Tailor your content format—how-to guides for
                      informational, comparison tables for commercial, optimized
                      landing pages for transactional.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-primary">
                      People Also Ask & Search For
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-card dark:bg-background rounded-lg p-4">
                        <h5 className="font-semibold mb-2 flex items-center">
                          <Search
                            className="text-primary mr-2 min-h-4 min-w-4"
                            size={16}
                          />
                          People Also Ask
                        </h5>
                        <p className="text-foreground/80 text-sm">
                          Real questions you can answer in FAQs, listicles, or
                          featured-snippet drafts.
                        </p>
                      </div>
                      <div className="bg-card dark:bg-background rounded-lg p-4">
                        <h5 className="font-semibold mb-2 flex items-center">
                          <TrendingUp
                            className="text-primary mr-2 min-h-4 min-w-4"
                            size={16}
                          />
                          People Also Search For
                        </h5>
                        <p className="text-foreground/80 text-sm">
                          Related topics/angles for internal linking and topic
                          clusters.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-card dark:bg-background rounded-lg p-6">
                      <h5 className="font-bold mb-3 flex items-center">
                        <Eye
                          className="text-primary mr-2 min-h-4 min-w-4"
                          size={16}
                        />
                        SERP Structure & Heading Analysis
                      </h5>
                      <ul className="space-y-2 text-foreground/80 text-sm">
                        <li>
                          • See exactly how top-ranking pages structure their
                          H2s and H3s
                        </li>
                        <li>• Identify gaps in coverage</li>
                        <li>
                          • If every competitor has an &quot;H2: Health Benefits,&quot;
                          you know that&apos;s a must-cover section
                        </li>
                      </ul>
                    </div>
                    <div className="bg-card dark:bg-background rounded-lg p-6">
                      <h5 className="font-bold mb-3 flex items-center">
                        <Calendar
                          className="text-primary mr-2 min-h-4 min-w-4"
                          size={16}
                        />
                        Google Trends Overlay
                      </h5>
                      <ul className="space-y-2 text-foreground/80 text-sm">
                        <li>
                          • Spot seasonality peaks and plan content calendars
                        </li>
                        <li>• Ideal for evergreen vs. timely campaigns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold mb-6 text-primary">
                      Putting It to Work: SEO, AI & PPC
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-card dark:bg-background rounded-lg p-6 border-l-4 border-green-500">
                        <h5 className="font-bold mb-3">SEO Content Planning</h5>
                        <p className="text-foreground/80 text-sm">
                          Build pillar pages and clusters based on your intent
                          breakdown and question data.
                        </p>
                      </div>
                      <div className="bg-card dark:bg-background rounded-lg p-6 border-l-4 border-blue-500">
                        <h5 className="font-bold mb-3">On-Page Optimization</h5>
                        <p className="text-foreground/80 text-sm">
                          Mirror top-ranked heading structures, sprinkle related
                          keywords naturally.
                        </p>
                      </div>
                      <div className="bg-card dark:bg-background rounded-lg p-6 border-l-4 border-purple-500">
                        <h5 className="font-bold mb-3">
                          AI Content Generation
                        </h5>
                        <p className="text-foreground/80 text-sm">
                          Feed your AI writer a structured outline from the SERP
                          analysis.
                        </p>
                      </div>
                      <div className="bg-card dark:bg-background rounded-lg p-6 border-l-4 border-orange-500">
                        <h5 className="font-bold mb-3">PPC Campaigns</h5>
                        <p className="text-foreground/80 text-sm">
                          Target high-CPC, high-intent keywords using
                          competition density data.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card dark:bg-background rounded-lg p-8 border border-border">
                    <h5 className="text-xl font-bold mb-5 flex items-center">
                      <Zap
                        className="text-primary mr-3 min-h-6 min-w-6"
                        size={24}
                      />
                      Best Practices & Pro Tips
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <CheckCircle
                            className="text-primary mr-3 mt-1 shrink-0 min-h-4 min-w-4"
                            size={16}
                          />
                          <div>
                            <span className="font-semibold">
                              Filter by Difficulty:
                            </span>
                            <p className="text-foreground/80 text-sm">
                              Use the slider to exclude ultra-competitive terms
                              if you&apos;re a smaller site.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle
                            className="text-primary mr-3 mt-1 shrink-0 min-h-4 min-w-4"
                            size={16}
                          />
                          <div>
                            <span className="font-semibold">
                              Combine Metrics:
                            </span>
                            <p className="text-foreground/80 text-sm">
                              Don&apos;t pick purely on volume—aim for &quot;sweet spot&quot;
                              keywords with volume × CPC ÷ difficulty.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <CheckCircle
                            className="text-primary mr-3 mt-1 shrink-0 min-h-4 min-w-4"
                            size={16}
                          />
                          <div>
                            <span className="font-semibold">
                              Leverage Seasonal Data:
                            </span>
                            <p className="text-foreground/80 text-sm">
                              Schedule blog posts 4–6 weeks before trend peaks.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle
                            className="min-h-4 min-w-4 text-primary mr-3 mt-1 shrink-0"
                            size={16}
                          />
                          <div>
                            <span className="font-semibold">
                              Audit & Iterate:
                            </span>
                            <p className="text-foreground/80 text-sm">
                              Re-analyze your top pages quarterly to catch new
                              questions and fresh SERP features.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-background :bg-card border-border relative z-10">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to <span className="text-primary">Dominate</span> Your
              Keyword Research?
            </h2>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              Bookmark this page, tweak your input, and watch your content
              strategy evolve from guesswork to data-driven precision. Happy
              optimizing!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.querySelector("input").focus()}
                size="lg"
                className="bg-primary text-black hover:bg-primary/90 font-bold px-8 py-4 text-lg"
              >
                <Search className="mr-2" size={20} />
                Start Analyzing Keywords
              </Button>

              <Button
                variant="outline"
                href="/free-tools"
                size="lg"
                className="text-foreground"
              >
                <ArrowRight className="mr-2" size={20} />
                Explore More Tools
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default AdvancedKeywordAnalysisHero;
