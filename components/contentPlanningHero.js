"use client";
import React from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useFirebase } from "@/lib/firebase-context";
import { useRouter } from "next/navigation";
import { useUsage } from "@/lib/usage-context";
import { getPathname } from "@/lib/getpathname";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeroTemplate from "./HeroTemplate";

const options = [
  { value: "blog_post", label: "Blog Post" },
  { value: "product_page", label: "Product Page" },
  { value: "service_page", label: "Service Page" },
  { value: "landing_page", label: "Landing Page" },
  { value: "comparison_page", label: "Comparison Page" },
  { value: "guide", label: "Complete Guide" },
  { value: "list_post", label: "List Post" },
  { value: "tutorial", label: "Tutorial/How-To" },
  { value: "faq_page", label: "FAQ Page" },
];

function ContentPlanningHero() {
  const [keyword, setKeyword] = useState("");
  const [contentType, setContentType] = useState("blog_post");
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
          route: "content-planning",
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

    if (!keyword.trim()) {
      setError("Please enter a keyword");
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
    // setAnalysisData(null);
    console.log("keyword", keyword, "contentType", contentType);
    try {
      const formData = new FormData();
      formData.append("keyword", keyword);
      formData.append("content_type", contentType);

      const response = await fetch("/api/content-planning", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content analysis");
      }

      const data = await response.json();
      if (data.success) {
        clearAnalysis();
        trackAnalysis({
          type: "content-planning",
          docId: data.docId,
          collection: "contentPlanning",
          meta: {
            keyword: keyword,
          },
        });
        router.push(`${getPathname("content-planning")}/result?id=${data.docId}`);
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
    <main className="min-h-screen relative bg-background py-6 md:py-0">
      {/* Hero Section*/}
      <HeroTemplate noBg className="!md:pt-0 !pb-0 !md:pb-0 !mt-0 !pt-0 ">
        <Container>
          <section className="min-h-screen flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Keyword Input */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Content <span className="text-primary">Planning</span>
                </h1>
                <p className="text-xl ">
                  Plan your content strategy with detailed insights and
                  recommendations.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="relative">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. Best Keto Diet Plan"
                      className="w-full px-4 sm:px-6 py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="keyword" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Keyword</label>
                  </div>
                  <div className="relative">
                    <Select
                      value={contentType}
                      onValueChange={setContentType}
                      disabled={loading}
                    >
                      <SelectTrigger
                        size="lg"
                        className="w-full px-4 sm:px-6 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      >
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border border-border rounded-lg shadow-lg">
                        {options.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <label htmlFor="contentType" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Content Type</label>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full ${loading ? "animate-pulse" : ""
                      } disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
                    disabled={loading || usage?.remaining <= 0 || usage === null}
                  >
                    {loading ? "Analyzing..." : "Analyze Content Structure"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
                        <h3 className="font-semibold">Content Insights</h3>
                        <p className="text-sm text-muted-foreground">
                          Detailed analysis of content strategy
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Quality</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                          Excellent
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SEO Optimization</span>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                          Needs Improvement
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Engagement</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                          High
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
    </main>
  );
}

export default ContentPlanningHero;
