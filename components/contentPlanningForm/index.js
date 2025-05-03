import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useUsage } from '@/lib/usage-context'
import { useFirebase } from '@/lib/firebase-context'
import { toast } from 'sonner'

function ContentPlanningForm() {
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { usage, setUsage } = useUsage();
  const { trackContentPlanning, currentContentPlanning, removeLLMTxt, removeAdvancedKeywordAnalysis } = useFirebase();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usage?.remaining <= 0) {
      toast.error("You have reached your daily limit. Please try again tomorrow.");
      return;
    }
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
    // setAnalysisData(null);
    console.log('keyword', keyword, 'contentType', contentType);
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
        removeLLMTxt();
        removeAdvancedKeywordAnalysis();
        trackContentPlanning(data.docId, keyword);
        setUsage(prevUsage => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1
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
    <>
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            required
            disabled={loading}
          />
        </div>
        <div className="relative">
          <select
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer"
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
        <Button
          type="submit"
          size="lg"
          className={`w-full ${loading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
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
    </>
  )
}

export default ContentPlanningForm