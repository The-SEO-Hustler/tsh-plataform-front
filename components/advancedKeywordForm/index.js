'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useUsage } from '@/lib/usage-context'
import { useFirebase } from '@/lib/firebase-context'
import { toast } from 'sonner'

function AdvancedKeywordForm() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const { usage, setUsage } = useUsage();
  const { trackAdvancedKeywordAnalysis, currentAdvancedKeywordAnalysis, removeAdvancedKeywordAnalysis, removeLLMTxt, removeContentPlanning } = useFirebase();
  const [error, setError] = useState(null);

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
      toast.error("You have reached your daily limit. Please try again tomorrow.");
      return;
    }

    if (currentAdvancedKeywordAnalysis && (currentAdvancedKeywordAnalysis?.status !== "completed" && currentAdvancedKeywordAnalysis?.status !== "failed")) {
      toast.error("Please wait for the previous analysis to complete.");
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
        removeLLMTxt();
        removeContentPlanning();
        removeAdvancedKeywordAnalysis();
        trackAdvancedKeywordAnalysis(data.docId, keyword);
        // router.push(`/advanced-keyword-analysis/result?id=${data.docId}`);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword..."
            className="w-full px-4 sm:px-6 sm:pr-[240px] pr-[60px] py-4 text-lg border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            required
            disabled={loading}
          />
          <Button
            type="submit"
            size="lg"
            className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 ${loading ? "animate-pulse !bg-primary !text-primary-foreground" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
            disabled={loading || usage?.remaining <= 0 || usage === null}
          >
            <span className='sm:block hidden'>{loading ? "Analyzing..." : "Analyze Keyword"}</span>
            <ArrowRight className="sm:ml-2 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </>
  )
}

export default AdvancedKeywordForm;