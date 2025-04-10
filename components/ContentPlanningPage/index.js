"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, TriangleAlert, LoaderCircle, ArrowLeft } from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreenContentPlanning from "@/components/LoadingScreenContentPlanning";

function ContentPlanning() {
  const [keyword, setKeyword] = useState("");
  const [contentType, setContentType] = useState("blog_post");
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");

  const { trackContentPlanning, currentContentPlanning, removeAnalysis } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentContentPlanning ? currentContentPlanning.status : "initializing"
  );

  useEffect(() => {
    // Start tracking this analysis in the global context.

    if (docId) {
      trackContentPlanning(docId, keyword);
    }
  }, [docId, router, trackContentPlanning, keyword]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentContentPlanning && currentContentPlanning.type === "content-planning") {
      setStatus(currentContentPlanning.status);
      setAnalysisData(currentContentPlanning.data || null);
      setKeyword(currentContentPlanning.keyword || "");
      setContentType(currentContentPlanning.contentType || "blog_post");
      setUpdatedAt(currentContentPlanning.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (
        currentContentPlanning.status === "completed" ||
        currentContentPlanning.status === "failed"
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentContentPlanning.error) {
        setError(currentContentPlanning.error);
      }
    }
  }, [currentContentPlanning]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentContentPlanning && (currentContentPlanning?.status !== "completed" && currentContentPlanning?.status !== "failed")) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    if (!keyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    if (
      currentContentPlanning &&
      currentContentPlanning?.status !== "completed" &&
      currentContentPlanning?.status !== "failed"
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
        removeAnalysis();
        trackContentPlanning(data.docId, keyword);
        router.push(`/content-planning?id=${data.docId}`);
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching content analysis"
      );
      setLoading(false);
    }
  };

  const renderHeadingStructure = (headings) => {
    return (
      <ul className="space-y-2">
        {headings?.map((heading, index) => (
          <li key={index} className="border-b border-border/10 pb-2">
            <div>
              <span className="font-semibold">{heading.level}:</span>{" "}
              {heading.text}
            </div>
            {heading.children && heading.children.length > 0 && (
              <div className="ml-4 mt-2">
                {renderHeadingStructure(heading.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // If no docId, show the form
  if (!docId) {
    return (
      <Container className="!py-16">
        <h1 className="text-3xl font-bold mb-6">Content Planning</h1>

        <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="keyword"
                className="block text-sm font-medium text-foreground mb-1"
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

            <div className="mb-4">
              <label
                htmlFor="contentType"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Content Type
              </label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                disabled={loading}
              >
                <option value="blog_post">Blog Post</option>
                <option value="product_page">Product Page</option>
                <option value="service_page">Service Page</option>
                <option value="landing_page">Landing Page</option>
                <option value="comparison_page">Comparison Page</option>
                <option value="guide">Complete Guide</option>
                <option value="list_post">List Post</option>
                <option value="tutorial">Tutorial/How-To</option>
                <option value="faq_page">FAQ Page</option>
              </select>
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
                  <Search className="mr-2 h-4 w-4" /> Analyze Content Structure
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

  // If there's an error, show the error screen
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

  // If loading, show the loading screen
  if (loadingPage) {
    return (
      <>
        <LoadingScreenContentPlanning status={status} docId={docId} />
      </>
    );
  }

  // If we have data, show the content planning results
  return (
    <Container className="!py-16">
      <Link href="/content-planning" className="h-10 w-10 mb-6 flex items-center justify-center rounded-full bg-muted/80 text-primary-foreground">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <h1 className="text-3xl font-bold mb-6">Content Planning</h1>
      {analysisData && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-border mb-6">
            <div className="border-b border-border p-4">
              <h3 className="text-xl font-bold">
                User Persona for "{analysisData?.keyword}"
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">Demographics</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-border/10 pb-2">
                      <span className="font-medium">Age Range:</span>
                      <span>{analysisData?.user_persona?.age_range}</span>
                    </li>
                    <li className="flex justify-between border-b border-border/10 pb-2">
                      <span className="font-medium">Gender:</span>
                      <span>{analysisData?.user_persona?.gender}</span>
                    </li>
                    <li className="flex justify-between border-b border-border/10 pb-2">
                      <span className="font-medium">Education Level:</span>
                      <span>{analysisData?.user_persona?.education_level}</span>
                    </li>
                    <li className="flex justify-between border-b border-border/10 pb-2">
                      <span className="font-medium">Income Level:</span>
                      <span>{analysisData?.user_persona?.income_level}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">Goals</h4>
                  <ul className="space-y-2">
                    {analysisData?.user_persona?.goals?.map((goal, index) => (
                      <li
                        key={index}
                        className="border-b border-border/10 pb-2"
                      >
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">Pain Points</h4>
                  <ul className="space-y-2">
                    {analysisData?.user_persona?.pain_points?.map(
                      (painPoint, index) => (
                        <li
                          key={index}
                          className="border-b border-border/10 pb-2"
                        >
                          {painPoint}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">Objections</h4>
                  <ul className="space-y-2">
                    {analysisData?.user_persona?.objections?.map(
                      (objection, index) => (
                        <li
                          key={index}
                          className="border-b border-border/10 pb-2"
                        >
                          {objection}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">
                    Information Needs
                  </h4>
                  <ul className="space-y-2">
                    {analysisData?.user_persona?.information_needs?.map(
                      (need, index) => (
                        <li
                          key={index}
                          className="border-b border-border/10 pb-2"
                        >
                          {need}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border mb-6">
            <div className="border-b border-border p-4">
              <h3 className="text-xl font-bold">
                Content Structure Recommendations
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">On-Page SEO</h4>
                  <ul className="space-y-2">
                    <li className="flex flex-col border-b border-border/10 pb-2">
                      <span className="font-medium">Title:</span>
                      <span className="mt-1">
                        {analysisData?.content_structure?.title}
                      </span>
                    </li>
                    <li className="flex flex-col border-b border-border/10 pb-2">
                      <span className="font-medium">Meta Description:</span>
                      <span className="mt-1">
                        {analysisData?.content_structure?.meta_description}
                      </span>
                    </li>
                    <li className="flex flex-col border-b border-border/10 pb-2">
                      <span className="font-medium">Word Count Range:</span>
                      <span className="mt-1">
                        {analysisData?.content_structure?.word_count_range}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">Introduction</h4>
                  <p>{analysisData?.content_structure?.introduction}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold mb-3">
                  Recommended Heading Structure
                </h4>
                {renderHeadingStructure(
                  analysisData?.content_structure?.headings
                )}

                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Section Explanations</h5>
                  <p>{analysisData?.content_structure?.sections_explanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">
                    Internal Linking Strategy
                  </h4>
                  <ul className="space-y-2">
                    {analysisData?.content_structure?.internal_linking_strategy?.map(
                      (strategy, index) => (
                        <li
                          key={index}
                          className="border-b border-border/10 pb-2"
                        >
                          {strategy}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3">
                    Content Writing Tips
                  </h4>
                  <ul className="space-y-2">
                    {analysisData?.content_structure?.content_tips?.map(
                      (tip, index) => (
                        <li
                          key={index}
                          className="border-b border-border/10 pb-2"
                        >
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mt-6">
                <h4 className="text-lg font-semibold mb-3">
                  Call-to-Action Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysisData?.content_structure?.cta_recommendations?.map(
                    (cta, index) => (
                      <li
                        key={index}
                        className="border-b border-border/10 pb-2"
                      >
                        {cta}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default function ContentPlanningPage() {
  return (
    <Suspense>
      <ContentPlanning />
    </Suspense>
  );
}
